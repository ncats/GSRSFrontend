import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OverlayContainer } from "@angular/cdk/overlay";
import { ScrollToService } from "../../scroll-to/scroll-to.service";
import { Subscription } from "rxjs";
import { GoogleAnalyticsService } from "../../google-analytics/google-analytics.service";
import { ConfigService } from "@gsrs-core/config/config.service";
import {
  SubstanceCardBaseFilteredList,
  SubstanceCardBaseList,
} from "../../substance-form/base-classes/substance-form-base-filtered-list";
import { SubstanceFormService } from "../../substance-form/substance-form.service";
/*
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceFormBase } from '../../substance-form/base-classes/substance-form-base';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
*/
import { SubstanceService } from "../../substance/substance.service";
import {
  SubstanceSummary,
  SubstanceRelationship,
} from "../../substance/substance.model";
import {
  SpecifiedSubstanceG4mProcess,
  SubstanceRelated,
} from "../../substance/substance.model";
import { SubstanceDetail } from "@gsrs-core/substance/substance.model";
import { SubstanceFormSsg4mStagesService } from "./substance-form-ssg4m-stages.service";
import { SubstanceDraftsComponent } from "@gsrs-core/substance-form/substance-drafts/substance-drafts.component";
import { SpecifiedSubstanceG4mStage } from "@gsrs-core/substance/substance.model";
import { ConfirmDialogComponent } from "../../../fda/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-ssg4m-stages-form",
  templateUrl: "./ssg4m-stages-form.component.html",
  styleUrls: ["./ssg4m-stages-form.component.scss"],
})
export class Ssg4mStagesFormComponent implements OnInit, OnDestroy {
  public configSettingsDisplay = {};
  private overlayContainer: HTMLElement;
  configSsg4Form: any;
  configTitleStage: string;
  configTitleProcessingMaterials: string;
  privateStage: SpecifiedSubstanceG4mStage;
  privateProcessIndex: number;
  privateSiteIndex: number;
  privateStageIndex: number;
  privateShowAdvancedSettings: boolean;
  privateTabSelectedView: string;
  substance: SubstanceDetail;
  subscriptions: Array<Subscription> = [];

  constructor(
    public substanceFormSsg4mStagesService: SubstanceFormSsg4mStagesService,
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer,
    private scrollToService: ScrollToService,
    public configService: ConfigService,
    private dialog: MatDialog
  ) {}

  @Input()
  set stage(stage: SpecifiedSubstanceG4mStage) {
    this.privateStage = stage;
  }

  get stage(): SpecifiedSubstanceG4mStage {
    return this.privateStage;
  }

  @Input()
  set processIndex(processIndex: number) {
    this.privateProcessIndex = processIndex;
  }

  get processIndex(): number {
    return this.privateProcessIndex;
  }

  @Input()
  set siteIndex(siteIndex: number) {
    this.privateSiteIndex = siteIndex;
  }

  get siteIndex(): number {
    return this.privateSiteIndex;
  }

  @Input()
  set stageIndex(stageIndex: number) {
    this.privateStageIndex = stageIndex;
    // Set the Stage Name
    // alert("STAGE INDEX: " + stageIndex);
    this.privateStage.stageNumber = String(this.privateStageIndex + 1);
  }

  get stageIndex(): number {
    return this.privateStageIndex;
  }

  @Input()
  set showAdvancedSettings(showAdvancedSettings: boolean) {
    this.privateShowAdvancedSettings = showAdvancedSettings;
    // Get Config Settins from config file
    this.getConfigSettings();
  }

  get showAdvancedSettings(): boolean {
    return this.privateShowAdvancedSettings;
  }

  @Input()
  set tabSelectedView(tabSelectedView: string) {
    this.privateTabSelectedView = tabSelectedView;
  }

  get tabSelectedView(): string {
    return this.privateTabSelectedView;
  }

  ngOnInit(): void {
    // this.substance = this.substanceFormSsg4mStagesService.substance;
    const subscription = this.substanceFormService.substance.subscribe(
      (substance) => {
        this.substance = substance;
      }
    );
    this.subscriptions.push(subscription);

    // overlay container for dialogs
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    // Get Config variables for SSG4m
    this.configSsg4Form =
      (this.configService.configData &&
        this.configService.configData.ssg4Form) ||
      null;
    this.configTitleStage = "Stage";
    this.configTitleProcessingMaterials = "Processing Materials";
    if (this.configSsg4Form) {
      this.configTitleStage = this.configSsg4Form.titles.stage || null;
      if (!this.configTitleStage) {
        this.configTitleStage = "Stage";
      }
      this.configTitleProcessingMaterials =
        this.configSsg4Form.titles.processingMaterials || null;
      if (!this.configTitleProcessingMaterials) {
        this.configTitleProcessingMaterials = "Processing Materials";
      }
    }
  }

  ngOnDestroy(): void {
    // this.substanceFormService.unloadSubstance();
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  getConfigSettings(): void {
    // Get SSG4 Config Settings from config.json file to show and hide fields in the form
    let configSsg4Form: any;
    configSsg4Form =
      (this.configService.configData &&
        this.configService.configData.ssg4Form) ||
      null;
    // Get 'stage' json values from config
    const confSettings = configSsg4Form.settingsDisplay.stage;
    Object.keys(confSettings).forEach((key) => {
      if (confSettings[key] != null) {
        if (confSettings[key] === "simple") {
          this.configSettingsDisplay[key] = true;
        } else if (confSettings[key] === "advanced") {
          if (this.privateShowAdvancedSettings === true) {
            this.configSettingsDisplay[key] = true;
          } else {
            this.configSettingsDisplay[key] = false;
          }
        } else if (confSettings[key] === "removed") {
          this.configSettingsDisplay[key] = false;
        }
      }
    });
  }

  insertStage(
    processIndex: number,
    siteIndex: number,
    stageIndex: number,
    insertDirection?: string
  ): void {
    this.substanceFormSsg4mStagesService.insertStage(
      processIndex,
      siteIndex,
      stageIndex,
      insertDirection
    );
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-0`, "center");
    });
  }

  duplicateStage(
    processIndex: number,
    siteIndex: number,
    stageIndex: number,
    insertDirection?: string
  ): void {
    this.substanceFormSsg4mStagesService.duplicateStage(
      processIndex,
      siteIndex,
      stageIndex,
      insertDirection
    );
    setTimeout(() => {
      this.scrollToService.scrollToElement(
        `substance-stage-duplicate-0`,
        "center"
      );
    });
  }

  addCriticalParameter(
    processIndex: number,
    siteIndex: number,
    stageIndex: number
  ) {
    this.substanceFormSsg4mStagesService.addCriticalParameter(
      processIndex,
      siteIndex,
      stageIndex
    );
    setTimeout(() => {
      this.scrollToService.scrollToElement(
        `substance-process-site-stage-criticalParam-0`,
        "center"
      );
    });
  }

  addStartingMaterial(
    processIndex: number,
    siteIndex: number,
    stageIndex: number
  ) {
    this.substanceFormSsg4mStagesService.addStartingMaterials(
      processIndex,
      siteIndex,
      stageIndex
    );
    setTimeout(() => {
      this.scrollToService.scrollToElement(
        `substance-process-site-stage-startMat-0`,
        "center"
      );
    });
  }

  addProcessingMaterial(
    processIndex: number,
    siteIndex: number,
    stageIndex: number
  ) {
    this.substanceFormSsg4mStagesService.addProcessingMaterials(
      processIndex,
      siteIndex,
      stageIndex
    );
    setTimeout(() => {
      this.scrollToService.scrollToElement(
        `substance-process-site-stage-processMat-0`,
        "center"
      );
    });
  }

  addResultingMaterial(
    processIndex: number,
    siteIndex: number,
    stageIndex: number
  ) {
    this.substanceFormSsg4mStagesService.addResultingMaterials(
      processIndex,
      siteIndex,
      stageIndex
    );
    setTimeout(() => {
      this.scrollToService.scrollToElement(
        `substance-process-site-stage-resultMat-0`,
        "center"
      );
    });
  }

  confirmDeleteStage() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message:
          "Are you sure you want to delele " +
          this.configTitleStage +
          " " +
          (this.stageIndex + 1) +
          " for Site " +
          (this.siteIndex + 1) +
          " for Process " +
          (this.processIndex + 1) +
          "?",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.deleteStage();
      }
    });
  }

  deleteStage(): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[
      this.siteIndex
    ].stages.splice(this.stageIndex, 1);
  }

  /**
   * Open drafts dialog and add selected draft as a Starting Material for this stage
   */
  addStartingMaterialFromDraft(
    processIndex: number,
    siteIndex: number,
    stageIndex: number
  ) {
    const dialogRef = this.dialog.open(SubstanceDraftsComponent, {
      maxHeight: "85%",
      width: "70%",
      data: { uuid: this.substance ? this.substance.uuid : null },
    });
    if (this.overlayContainer) {
      this.overlayContainer.style.zIndex = "1002";
    }

    const sub = dialogRef.afterClosed().subscribe((response) => {
      if (this.overlayContainer) {
        this.overlayContainer.style.zIndex = null;
      }
      if (response && response.substance) {
        const read = response.substance;

        // Add a new starting material then set its substanceName to reference the selected draft
        this.substanceFormSsg4mStagesService.addStartingMaterials(
          processIndex,
          siteIndex,
          stageIndex
        );

        const stageObj =
          this.substance.specifiedSubstanceG4m.process[processIndex].sites[
            siteIndex
          ].stages[stageIndex];
        const newStartIndex = stageObj.startingMaterials.length - 1;

        // Determine a display name for the substance
        let displayName = response.name
          ? String(response.name).replace(/<[^>]*>?/gm, "")
          : null;
        if (!displayName && read.names && read.names.length > 0) {
          const n = read.names.find((x) => x.stdName) || read.names[0];
          displayName = n.stdName || n.name || null;
        }

        stageObj.startingMaterials[newStartIndex].substanceName = {
          refuuid: read.uuid,
          name: displayName,
          substanceClass: read.substanceClass,
        } as any;

        // notify subscribers about the change
        this.substanceFormSsg4mStagesService.propertyEmitter.next(
          stageObj.startingMaterials
        );
      }
      sub.unsubscribe();
    });
  }

  /*
  addStage(processIndex: number, siteIndex: number) {
    this.substanceFormSsg4mStagesService.addStage(processIndex, siteIndex);
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-site-stage-0`, 'center');
    });
  }
  */
}
