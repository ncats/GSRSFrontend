import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import * as moment from "moment";

/* GSRS Invitro Pharmacology Imports */
import { ConfirmDialogComponent } from "../../../confirm-dialog/confirm-dialog.component";
import {
  InvitroPharmacologyDraftService,
  IvpDraft,
  IvpDraftType,
  IVP_DRAFT_TYPES,
} from "../../service/invitro-pharmacology-draft.service";

export interface InvitroPharmacologyDraftsDialogData {
  // 'manage': list, load, delete, export and import drafts. 'select': pick one draft (e.g. a draft assay).
  mode?: "manage" | "select";
  // Type of the form that opened the dialog
  currentType?: IvpDraftType;
  // Draft loaded in the form that opened the dialog
  currentUuid?: string;
  // Only show (and allow) these draft types
  types?: Array<IvpDraftType>;
}

export interface InvitroPharmacologyDraftsDialogResult {
  action: "load" | "select";
  draft: IvpDraft;
}

// precisionFDA only: lists the In Vitro Pharmacology drafts saved in this browser.
@Component({
  selector: "app-invitro-pharmacology-drafts",
  templateUrl: "./invitro-pharmacology-drafts.component.html",
  styleUrls: ["./invitro-pharmacology-drafts.component.scss"],
  standalone: false,
})
export class InvitroPharmacologyDraftsComponent implements OnInit {
  mode: "manage" | "select" = "manage";
  availableTypes: Array<IvpDraftType> = IVP_DRAFT_TYPES;
  shownTypes: { [type: string]: boolean } = {};
  drafts: Array<IvpDraft> = [];
  filtered: Array<IvpDraft> = [];
  selectedKeys: Array<string> = [];
  displayedColumns: Array<string> = [];

  importFileName: string = null;
  importErrors: Array<string> = [];
  importMessage: string = null;

  // Opens the drafts dialog above the fixed form toolbar. Emits the dialog result (undefined when closed).
  static open(
    dialog: MatDialog,
    overlayContainer: HTMLElement,
    data: InvitroPharmacologyDraftsDialogData,
  ): Observable<InvitroPharmacologyDraftsDialogResult> {
    const dialogRef = dialog.open(InvitroPharmacologyDraftsComponent, {
      width: "1100px",
      maxWidth: "95vw",
      maxHeight: "90vh",
      autoFocus: false,
      data: data,
    });
    if (overlayContainer) {
      overlayContainer.style.zIndex = "1002";
    }
    return dialogRef.afterClosed().pipe(
      take(1),
      map((result) => {
        if (overlayContainer) {
          overlayContainer.style.zIndex = null;
        }
        return result;
      }),
    );
  }

  constructor(
    private draftService: InvitroPharmacologyDraftService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<
      InvitroPharmacologyDraftsComponent,
      InvitroPharmacologyDraftsDialogResult
    >,
    @Inject(MAT_DIALOG_DATA) public data: InvitroPharmacologyDraftsDialogData,
  ) {
    this.data = data || {};
  }

  ngOnInit(): void {
    this.mode = this.data.mode || "manage";
    if (this.data.types && this.data.types.length > 0) {
      this.availableTypes = IVP_DRAFT_TYPES.filter((type) =>
        this.data.types.includes(type),
      );
    }
    this.availableTypes.forEach((type) => (this.shownTypes[type] = true));
    this.displayedColumns =
      this.mode === "select"
        ? ["type", "name", "details", "date", "actions"]
        : ["select", "type", "name", "details", "date", "actions"];
    this.fetchDrafts();
  }

  get title(): string {
    return this.mode === "select"
      ? "Select a Draft " + this.typesLabel
      : "In Vitro Pharmacology Drafts";
  }

  get typesLabel(): string {
    return this.availableTypes.map((type) => this.typeLabel(type)).join(" / ");
  }

  typeLabel(type: string): string {
    return this.draftService.getTypeLabel(type);
  }

  describe(draft: IvpDraft): string {
    return this.draftService.describeDraft(draft);
  }

  isCurrent(draft: IvpDraft): boolean {
    return (
      !!this.data.currentUuid &&
      draft.uuid === this.data.currentUuid &&
      draft.type === this.data.currentType
    );
  }

  fetchDrafts(): void {
    this.drafts = this.draftService
      .getDrafts()
      .filter((draft) => this.availableTypes.includes(draft.type));
    this.drafts.forEach(
      (draft) => (draft.fromNow = moment(draft.date).fromNow()),
    );
    const keys = this.drafts.map((draft) => draft.key);
    this.selectedKeys = this.selectedKeys.filter((key) => keys.includes(key));
    this.applyFilter();
  }

  applyFilter(): void {
    this.filtered = this.drafts.filter((draft) => this.shownTypes[draft.type]);
  }

  toggleType(type: string, checked: boolean): void {
    this.shownTypes[type] = checked;
    this.applyFilter();
  }

  countByType(type: string): number {
    return this.drafts.filter((draft) => draft.type === type).length;
  }

  isSelected(draft: IvpDraft): boolean {
    return this.selectedKeys.includes(draft.key);
  }

  toggleDraft(draft: IvpDraft, checked: boolean): void {
    this.selectedKeys = this.selectedKeys.filter((key) => key !== draft.key);
    if (checked) {
      this.selectedKeys.push(draft.key);
    }
  }

  get allFilteredSelected(): boolean {
    return (
      this.filtered.length > 0 &&
      this.filtered.every((draft) => this.isSelected(draft))
    );
  }

  toggleAll(checked: boolean): void {
    this.filtered.forEach((draft) => this.toggleDraft(draft, checked));
  }

  useDraft(draft: IvpDraft): void {
    this.dialogRef.close({
      action: this.mode === "select" ? "select" : "load",
      draft: draft,
    });
  }

  deleteDraft(draft: IvpDraft): void {
    let message =
      "Delete the " +
      this.typeLabel(draft.type) +
      ' draft "' +
      draft.name +
      '" from this browser?';
    if (draft.type === "assayset") {
      const count = this.draftService.getDraftAssaysBySet(
        this.draftService.getAssaySetDraftName(draft),
      ).length;
      if (count > 0) {
        message +=
          " The Assay Set will also be removed from its " +
          count +
          " draft assay" +
          (count === 1 ? "" : "s") +
          ".";
      }
    }
    message += " This cannot be undone unless you have exported it.";
    const confirmRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: message },
    });
    confirmRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed === true) {
          this.draftService.deleteDraft(draft);
          this.fetchDrafts();
        }
      });
  }

  exportSelected(): void {
    this.export(
      this.drafts.filter((draft) => this.selectedKeys.includes(draft.key)),
    );
  }

  exportAll(): void {
    this.export(this.drafts);
  }

  private export(drafts: Array<IvpDraft>): void {
    if (drafts.length === 0) {
      return;
    }
    const fileName =
      drafts.length === 1
        ? "gsrs-ivp-" + drafts[0].type + "-draft-" + drafts[0].uuid
        : "gsrs-ivp-drafts-" + Date.now();
    this.draftService.exportDrafts(drafts, fileName);
  }

  openImport(input: HTMLInputElement): void {
    input.value = "";
    input.click();
  }

  onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    // Allows selecting the same file again
    input.value = "";
    this.importErrors = [];
    this.importMessage = null;
    if (!file) {
      return;
    }
    this.importFileName = file.name;
    const reader = new FileReader();
    reader.onload = () => this.importText(String(reader.result || ""));
    reader.onerror = () =>
      (this.importErrors = ['The file "' + file.name + '" could not be read.']);
    reader.readAsText(file);
  }

  importText(text: string): void {
    const result = this.draftService.parseBackup(text);
    this.importErrors = result.errors;
    this.importMessage = null;
    if (result.drafts.length === 0) {
      if (this.importErrors.length === 0) {
        this.importErrors = ["No drafts were found in the file."];
      }
      return;
    }
    try {
      const counts = this.draftService.importDrafts(result.drafts);
      const parts = [];
      if (counts.added > 0) {
        parts.push(counts.added + " new");
      }
      if (counts.replaced > 0) {
        parts.push(counts.replaced + " replaced");
      }
      this.importMessage =
        "Imported " +
        result.drafts.length +
        " draft" +
        (result.drafts.length === 1 ? "" : "s") +
        " (" +
        parts.join(", ") +
        ")." +
        (result.errors.length > 0 ? " Some entries were skipped:" : "");
    } catch (e) {
      this.importErrors = [e && e.message ? e.message : String(e)].concat(
        this.importErrors,
      );
    }
    this.fetchDrafts();
  }

  close(): void {
    this.dialogRef.close();
  }
}
