import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import {
  SubstanceName,
  SubstanceNameOrg,
} from "../../substance/substance.model";
import { ControlledVocabularyService } from "../../controlled-vocabulary/controlled-vocabulary.service";
import { FormControl, Validators } from "@angular/forms";
import { MatRadioChange } from "@angular/material/radio";
import { UtilsService } from "../../utils/utils.service";
import { Subscription } from "rxjs";
import { NameResolverDialogComponent } from "@gsrs-core/name-resolver/name-resolver-dialog.component";
import { OverlayContainer } from "@angular/cdk/overlay";
import { MatDialog } from "@angular/material/dialog";
import { SubstanceFormService } from "@gsrs-core/substance-form/substance-form.service";
import { SubstanceFormNamesService } from "@gsrs-core/substance-form/names/substance-form-names.service";
import { AuthService } from "@gsrs-core/auth";

@Component({
  selector: "app-name-form",
  templateUrl: "./name-form.component.html",
  styleUrls: ["./name-form.component.scss"],
  standalone: false,
})
export class NameFormComponent implements OnInit, OnDestroy {
  private privateName: SubstanceName;
  @Output() priorityUpdate = new EventEmitter<SubstanceName>();
  @Output() nameDeleted = new EventEmitter<SubstanceName>();
  nameControl = new FormControl("");
  nameTypeControl = new FormControl("");
  deleteTimer: any;
  private subscriptions: Array<Subscription> = [];
  overlayContainer: HTMLElement;
  substanceType: string | undefined = "";
  viewFull = true;
  showStd = false;
  canChangeDisplayName: boolean = false;
  substanceStatus: string = "";

  editorModules = {
    toolbar: [
      ['italic'],
      [{ script: 'sub' }, { script: 'super' }],
      ['clean']
    ],
    keyboard: {
      bindings: {
        preventEnter: {
          key: "Enter",
          handler: () => false
        }
      }
    }
  };

  allowedFormats = [
    'italic',
    'script'
  ];

  constructor(
    private cvService: ControlledVocabularyService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private substanceFormService: SubstanceFormService,
    private overlayContainerService: OverlayContainer,
    private nameFormService: SubstanceFormNamesService,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    this.subscriptions.push(
      this.nameControl.valueChanges.subscribe((html: string | null) => {
        if (this.privateName) {
          this.privateName.name = this.normalizeNameHtml(html);
        }
      }),
    );
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    const definition = this.substanceFormService.definition.subscribe((def) => {
      this.substanceType = def.substanceClass;
    });
    definition.unsubscribe();

    this.canChangeDisplayName = await this.authService.hasSpecificPrivilege(
      "Change Display Name for Approved",
    );

    this.substanceStatus = this.substanceFormService
      .getSubstanceStatus()
      .toUpperCase();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set show(val: boolean) {
    if (val != null) {
      this.viewFull = val;
    }
  }

  get show(): boolean {
    return this.viewFull || null;
  }

  @Input()
  set standardized(val: boolean) {
    if (val != null) {
      this.showStd = val;
    }
  }

  get standardized(): boolean {
    return this.showStd;
  }

  @Input()
  set name(name: SubstanceName) {
    if (name != null) {
      this.privateName = name;

      if (
        !this.privateName.languages ||
        this.privateName.languages.length === 0
      ) {
        this.privateName.languages = ["en"];
      }

      if (!this.privateName.type) {
        this.privateName.type = "cn";
      }

      this.nameControl.setValue(this.privateName.name ?? "", {
        emitEvent: false
      });
    }
  }

  get name(): SubstanceName {
    return this.privateName || {};
  }

  priorityUpdated(event: MatRadioChange) {
    this.privateName.displayName = event.value === "true";
    this.priorityUpdate.emit(this.privateName);
  }

  updateAccess(access: Array<string>): void {
    this.privateName.access = access;
  }

  updateLanguages(languages: Array<string>): void {
    this.privateName.languages = languages;
  }

  updateDomains(domains: Array<string>): void {
    this.privateName.domains = domains;
  }

  updateJurisdiction(jurisdiction: Array<string>): void {
    this.privateName.nameJurisdiction = jurisdiction;
  }

  deleteName(): void {
    this.privateName.$$deletedCode = this.utilsService.newUUID();

    if (!this.privateName.name && !this.privateName.type) {
      this.deleteTimer = setTimeout(() => {
        this.nameDeleted.emit(this.privateName);
      }, 2000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateName.$$deletedCode;
  }

  resolve(): void {
    const dialogRef = this.dialog.open(NameResolverDialogComponent, {
      height: "auto",
      width: "800px",
      data: { name: this.privateName.name },
    });
    this.overlayContainer.style.zIndex = "1002";
    dialogRef.afterClosed().subscribe(
      (molfile?: string) => {
        this.overlayContainer.style.zIndex = null;
        if (molfile != null && molfile !== "") {
          this.substanceFormService.resolvedName(molfile);
        }
      },
      () => {},
    );
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  getNameOrgs(name: SubstanceName): Array<SubstanceNameOrg> {
    if (!name.nameOrgs) {
      name.nameOrgs = [];
    }
    return name.nameOrgs as Array<SubstanceNameOrg>;
  }

  preventNewLine(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  private normalizeNameHtml(html: string | null): string {
   const value = (html ?? "").trim();

    return value === "<p><br></p>" || value === "<p></p>"
      ? ""
      : value
        .replace(/<P>/gi, "")
        .replace(/<\/p>/gi, "");
  }
}
