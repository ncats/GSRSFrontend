import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceSummary, SubstanceDetail } from '../substance/substance.model';
import { ConfigService } from '@gsrs-core/config';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AdvancedSelectorDialogComponent } from '@gsrs-core/substance-selector/advanced-selector-dialog/advanced-selector-dialog.component';
import { StructureImageModalComponent, StructureService } from '@gsrs-core/structure';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { Router } from '@angular/router';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { SubstanceDraftsComponent } from '@gsrs-core/substance-form/substance-drafts/substance-drafts.component';

@Component({
  selector: "app-substance-selector",
  templateUrl: "./substance-selector.component.html",
  styleUrls: ["./substance-selector.component.scss"],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubstanceSelectorComponent implements OnInit {
  selectedSubstance?: SubstanceSummary;
  @Input() eventCategory: string;
  @Output() selectionUpdated = new EventEmitter<SubstanceSummary>();
  @Output() draftSelected = new EventEmitter<any>();
  @Input() placeholder = "Search";
  @Input() label = "";
  @Input() hintMessage = "";
  @Input() header = "Substance";
  @Input() name?: string;
  @Input() hideImage?: boolean;
  @Input() showMorelinks? = false;
  @Input() showDraftOption? = false;
  errorMessage: string;
  showOptions: boolean;
  previousSubstance: SubstanceSummary;
  displayName: string;
  overlayContainer: any;
  savedRecord: SubstanceSummary;
  searchVal: string;

  // Change to configuration approach.
  private substanceSelectorProperties: Array<string> = null;
  /*
    'root_names_name',
    'root_names_stdName',
    'root_approvalID',
    'CAS',
    'ECHA\ \(EC\/EINECS\)'
  ];
  */
  constructor(
    public substanceService: SubstanceService,
    private substanceFormService: SubstanceFormService,
    public configService: ConfigService,
    private overlayContainerService: OverlayContainer,
    public scrollToService: ScrollToService,
    private dialog: MatDialog,
    private router: Router,
    private structureService: StructureService,
    private cdr: ChangeDetectorRef
  ) {}

  StoreSelection() {
    // sessionStorage.setItem('GSRS-default-selected-substance', JSON.stringify(this.selectedSubstance));
    this.substanceFormService.setStoredRelated(
      this.selectedSubstance,
      this.header,
    );
    alert(
      "Default " + this.header + " is set to " + this.selectedSubstance._name,
    );
  }

  ngOnInit() {
    // const data = sessionStorage.getItem('GSRS-default-selected-substance');
    const data = this.substanceFormService.getStoredRelated(this.header);
    if (data) {
      this.selectedSubstance = data;
      this.selectionUpdated.emit(this.selectedSubstance);
    }

    if (this.configService.configData.substanceSelectorProperties != null) {
      this.substanceSelectorProperties =
        this.configService.configData.substanceSelectorProperties;
    }
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  @Input()
  set subuuid(uuid: string) {
    if (uuid) {
      this.substanceService.getSubstanceSummary(uuid).subscribe(
        (response) => {
          this.selectedSubstance = response;
          this.errorMessage = "";
          this.cdr.markForCheck();
        },
        (error) => {
          if (this.name && this.name !== "") {
            this.selectedSubstance = { _name: this.name };
          } else {
            this.selectedSubstance = { _name: "" };
          }
          this.errorMessage = "Not in database";
          this.cdr.markForCheck();
        },
      );
    }
  }

  processSubstanceSearch(searchValue: string = ""): void {
    const q = searchValue.replace(/"/g, "");
    if (this.substanceService.isUUID(q)) {
      console.log("detected a UUID");
      this.substanceService.getSubstanceDetails(q).subscribe({
        next: (response) => {
          if (response && response != null) {
            this.selectedSubstance = response;
            this.selectionUpdated.emit(this.selectedSubstance);
            this.errorMessage = "";
            console.log("got substance via UUID");
          } else {
            console.log("no match for UUID");
            this.errorMessage = "No substances found";
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log("error retrieving UUID");
          this.errorMessage = "No substances found";
          this.cdr.markForCheck();
        },
      });
      return;
    }
    const searchStr = this.substanceSelectorProperties
      .map((property) => `${property}:\"^${q}$\"`)
      .join(" OR ");
    this.substanceService
      .getQuickSubstancesSummaries(searchStr, true)
      .subscribe((response) => {
        if (response.content && response.content.length) {
          this.selectedSubstance = response.content[0];
          this.selectionUpdated.emit(this.selectedSubstance);
          this.errorMessage = "";
        } else {
          this.errorMessage = "No substances found";
        }
        this.cdr.markForCheck();
      });
  }

  advanced(type: string): void {
    let thisy = window.pageYOffset;
    window.scroll({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    let active = 0;
    if (type === "name") {
      active = 1;
    }
    const dialogRef = this.dialog.open(AdvancedSelectorDialogComponent, {
      width: "100%",
      minWidth: "80%",
      maxWidth: "90%",
      height: "92%",
      panelClass: "advanced-selector-dialog",
      data: {
        uuid: this.selectedSubstance ? this.selectedSubstance.uuid : null,
        name: this.selectedSubstance ? this.selectedSubstance._name : null,
        tab: active,
      },
    });
    this.overlayContainer.style.zIndex = "1002";

    dialogRef.afterClosed().subscribe((result) => {
      window.scroll({
        top: thisy,
        left: 0,
        behavior: "auto",
      });
      if (result) {
        this.selectedSubstance = result;
        this.selectionUpdated.emit(result);
        this.errorMessage = "";
      }

      this.overlayContainer.style.zIndex = null;
      this.cdr.markForCheck();
    });
  }

  openImageModal() {
    let data: any;
    let molfile: string;
    let substance = this.selectedSubstance;

    // For draft substances, use the temporary structure ID
    const structureId = (substance as any).$$tmpStructureId || substance.uuid;
    const isDraft = (substance as any).$$tmpStructureId ? true : false;

    if (substance.substanceClass === "chemical") {
      data = {
        structure: structureId,
        smiles: substance.structure.smiles,
        uuid: substance.uuid,
        names: substance.names,
        component: "substanceSelector",
        isDraft: isDraft
      };
      molfile = substance.structure.molfile;
    } else {
      data = {
        structure: structureId,
        names: substance.names,
        component: "substanceSelector",
        uuid: substance.uuid,
        isDraft: isDraft
      };
      if (substance.polymer) {
        molfile = substance.polymer.idealizedStructure.molfile;
      } else {
        molfile = null;
      }
    }

    const dialogRef = this.dialog.open(StructureImageModalComponent, {
      width: "650px",
      panelClass: "structure-image-panel",
      data: data,
    });

    this.overlayContainer.style.zIndex = "1002";

    const subscription = dialogRef.afterClosed().subscribe(
      (response) => {
        this.overlayContainer.style.zIndex = null;
        subscription.unsubscribe();
      },
      () => {
        this.overlayContainer.style.zIndex = null;
        subscription.unsubscribe();
      },
    );
  }

  editSelectedSubstance(): void {
    this.previousSubstance = JSON.parse(JSON.stringify(this.selectedSubstance));
    this.selectedSubstance = null;
    this.searchVal = null;
    this.selectionUpdated.emit(this.selectedSubstance);
  }

  revertEdit(): void {
    this.selectedSubstance = JSON.parse(JSON.stringify(this.previousSubstance));
    this.selectionUpdated.emit(this.selectedSubstance);
  }

  delete(): void {
    this.selectedSubstance = null;
    this.selectionUpdated.emit(null);
  }

  openInNewTab(uuid: string): void {
    let url = "";
    if (
      this.configService.configData &&
      this.configService.configData.gsrsHomeBaseUrl
    ) {
      url =
        this.configService.configData.gsrsHomeBaseUrl + "/substances/" + uuid;
    } else {
      const baseUrl = window.location.href.replace(this.router.url, "");
      url =
        baseUrl +
        this.router.serializeUrl(
          this.router.createUrlTree(["/substances/" + uuid]),
        );
    }
    window.open(url, "_blank");
  }

  registerNew() {
    let url = "";
    if (
      this.configService.configData &&
      this.configService.configData.gsrsHomeBaseUrl
    ) {
      url =
        this.configService.configData.gsrsHomeBaseUrl + "/substances/register";
    } else {
      const baseUrl = window.location.href.replace(this.router.url, "");
      url =
        baseUrl +
        this.router.serializeUrl(
          this.router.createUrlTree(["/substances/register"]),
        );
    }
    window.open(url, "_blank");
  }

  selectDraft(): void {
    const dialogRef = this.dialog.open(SubstanceDraftsComponent, {
      maxHeight: '85%',
      width: '70%',
      data: {}
    });

    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;

      if (response === null || response === undefined) {
        return;
      }

      // dialog may return either an index (number) or the draft object.
      let draftObj: any = null;
      if (typeof response === 'number') {
        const comp = dialogRef.componentInstance as any;
        if (comp) {
          if (comp.filtered && comp.filtered[response]) {
            draftObj = comp.filtered[response];
          } else if (comp.values && comp.values[response]) {
            draftObj = comp.values[response];
          }
        }
      } else if (response && response.substance) {
        draftObj = response;
      } else {
        draftObj = response;
      }

      if (!draftObj) {
        return;
      }

      const substanceObj: SubstanceDetail = draftObj.substance || draftObj;

      // Determine a primary name for the draft substance
      const primaryName =
        substanceObj._name ||
        (substanceObj.names && substanceObj.names.length > 0
          ? substanceObj.names[0].name
          : null) ||
        draftObj.name ||
        null;

      // If the draft contains a structure (molfile or smiles), interpret it on the server
      // to obtain a temporary structure id that can be rendered via the same image API.
      const mol =
        substanceObj.structure && substanceObj.structure.molfile
          ? substanceObj.structure.molfile
          : substanceObj.structure && substanceObj.structure.smiles
          ? substanceObj.structure.smiles
          : null;

      if (mol) {
        this.structureService.interpretStructure(mol).subscribe(
          (interpretResponse) => {
            if (interpretResponse && interpretResponse.structure && interpretResponse.structure.id) {
              const tmpId = interpretResponse.structure.id;
              (substanceObj as any).$$tmpStructureId = tmpId;

              // Also update localStorage so processLocalDrafts can find and match the draft
              this.updateDraftInLocalStorage(draftObj, tmpId);
            }
            this.emitDraftSelection(draftObj, substanceObj, primaryName);
          },
          (err) => {
            // on error, still emit the draft selection without the structure id
            console.log('Error interpreting draft structure: ', err);
            this.emitDraftSelection(draftObj, substanceObj, primaryName);
          }
        );
      } else {
        this.emitDraftSelection(draftObj, substanceObj, primaryName);
      }
    });
  }

  private updateDraftInLocalStorage(draftObj: any, tmpStructureId: string): void {
    try {
      // Update the draft object with the temp structure id
      if (draftObj.substance) {
        draftObj.substance.$$tmpStructureId = tmpStructureId;
      } else {
        (draftObj as any).$$tmpStructureId = tmpStructureId;
      }

      // Persist back to localStorage if the draft has a key
      const draftKey = draftObj.key || draftObj.file;
      if (draftKey && draftKey.startsWith('gsrs-draft-')) {
        localStorage.setItem(draftKey, JSON.stringify(draftObj));
      }
    } catch (e) {
      // Ignore storage errors
      console.log('Error updating draft: ', e);
    }
  }

  private emitDraftSelection(draftObj: any, substanceObj: SubstanceDetail, primaryName: string): void {
    const tmpStructureId = (substanceObj as any).$$tmpStructureId || null;

    // Set selectedSubstance so the template can render the draft
    this.selectedSubstance = {
      _name: primaryName,
      uuid: substanceObj?.uuid,
      approvalID: substanceObj?.approvalID
    } as SubstanceSummary;

    // Attach the temp structure id for rendering
    if (tmpStructureId) {
      (this.selectedSubstance as any).$$tmpStructureId = tmpStructureId;
    }

    // Emit the draft selection with all relevant data for the parent component to handle
    this.draftSelected.emit({
      draft: draftObj,
      substance: substanceObj,
      primaryName: primaryName,
      tmpStructureId: tmpStructureId
    });
    this.cdr.markForCheck();
  }


}
