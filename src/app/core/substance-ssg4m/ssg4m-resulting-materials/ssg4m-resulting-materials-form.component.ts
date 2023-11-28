import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ConfigService } from '@gsrs-core/config/config.service';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { SpecifiedSubstanceG4mResultingMaterial, SubstanceAmount } from '@gsrs-core/substance/substance.model';
import { SubstanceFormSsg4mStagesService } from '../ssg4m-stages/substance-form-ssg4m-stages.service';
import { AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import { ConfirmDialogComponent } from '../../../fda/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ssg4m-resulting-materials-form',
  templateUrl: './ssg4m-resulting-materials-form.component.html',
  styleUrls: ['./ssg4m-resulting-materials-form.component.scss']
})
export class Ssg4mResultingMaterialsFormComponent implements OnInit, OnDestroy {

  @Input() resultingMaterialIndex: number;
  privateProcessIndex: number;
  privateSiteIndex: number;
  privateStageIndex: number;
  public configSettingsDisplay = {};
  privateShowAdvancedSettings: boolean;
  privateResultingMaterial: SpecifiedSubstanceG4mResultingMaterial;
  relatedSubstanceUuid: string;
  substance: SubstanceDetail;
  private overlayContainer: HTMLElement;
  loading = false;
  error = false;
  subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private substanceFormSsg4mStagesService: SubstanceFormSsg4mStagesService,
    private overlayContainerService: OverlayContainer,
    private utilsService: UtilsService,
    public configService: ConfigService,
    private dialog: MatDialog
  ) { }

  @Input()
  set resultingMaterial(resultingMaterial: SpecifiedSubstanceG4mResultingMaterial) {
    this.privateResultingMaterial = resultingMaterial;
  }

  get resultingMaterial(): SpecifiedSubstanceG4mResultingMaterial {
    return this.privateResultingMaterial;
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

  ngOnInit(): void {
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
    });
    this.subscriptions.push(subscription);

    // Load Substance Name
    if (this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].resultingMaterials[this.resultingMaterialIndex].substanceName) {
      let substanceRelated = this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].resultingMaterials[this.resultingMaterialIndex].substanceName;
      this.relatedSubstanceUuid = substanceRelated.refuuid;
    }
  }

  ngOnDestroy(): void {
    // this.substanceFormService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getConfigSettings(): void {
    // Get SSG4 Config Settings from config.json file to show and hide fields in the form
    let configSsg4Form: any;
    configSsg4Form = this.configService.configData && this.configService.configData.ssg4Form || null;
    // *** IMPORTANT: get the correct value. Get 'resultingMaterial' json values from config
    const confSettings = configSsg4Form.settingsDisplay.resultingMaterial;
    Object.keys(confSettings).forEach(key => {
      if (confSettings[key] != null) {
        if (confSettings[key] === 'simple') {
          this.configSettingsDisplay[key] = true;
        } else if (confSettings[key] === 'advanced') {
          if (this.privateShowAdvancedSettings === true) {
            this.configSettingsDisplay[key] = true;
          } else {
            this.configSettingsDisplay[key] = false;
          }
        } else if (confSettings[key] === 'removed') {
          this.configSettingsDisplay[key] = false;
        }
      }
    });
  }

  updateSubstanceRole(role: string): void {
    this.privateResultingMaterial.substanceRole = role;
  }

  updateSubstanceGrade(grade: string): void {
    this.privateResultingMaterial.substanceGrade = grade;
  }

  updateSpecificationType(specificationType: string): void {
    this.privateResultingMaterial.specificationType = specificationType;
  }

  updateAcceptanceCriteriaType(acceptanceCriteriaType: string, acceptanceIndex: number): void {
    this.privateResultingMaterial.acceptanceCriterias[acceptanceIndex].acceptanceCriteriaType = acceptanceCriteriaType;
  }

  relatedSubstanceUpdated(substance: SubstanceSummary): void {
    if (substance != null) {
      const relatedSubstance: SubstanceRelated = {
        refPname: substance._name,
        name: substance._name,
        refuuid: substance.uuid,
        substanceClass: 'reference',
        approvalID: substance.approvalID
      };
      this.privateResultingMaterial.substanceName = relatedSubstance;
    }
    else {
      this.privateResultingMaterial.substanceName = {};
    }
  }

  addAcceptanceCriteria(processIndex: number, siteIndex: number, stageIndex: number) {
    this.substanceFormSsg4mStagesService.addResultingAcceptanceCriteria(processIndex, siteIndex, stageIndex, this.resultingMaterialIndex);
  }

  confirmDeleteResultingMaterial() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Resulting Material ' + (this.resultingMaterialIndex + 1) + ' for Step ' + (this.stageIndex + 1) + ' for Site ' + (this.siteIndex + 1) + ' for Process ' + (this.processIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteResultingMaterial();
      }
    });
  }

  deleteResultingMaterial(): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].resultingMaterials.splice(this.resultingMaterialIndex, 1);
  }

  confirmDeleteAcceptanceCriteria(acceptanceIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Acceptance Criteria ' + (acceptanceIndex + 1) + ' for Processing Material ' + (this.resultingMaterialIndex + 1) + ' for Step ' + (this.stageIndex + 1) + ' for Site ' + (this.siteIndex + 1) + ' for Process ' + (this.processIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteAcceptanceCriteria(acceptanceIndex);
      }
    });
  }

  deleteAcceptanceCriteria(acceptanceIndex: number): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].resultingMaterials[this.resultingMaterialIndex].acceptanceCriterias.splice(acceptanceIndex, 1);
  }

  copyResultingToStarting() {
    this.substanceFormSsg4mStagesService.setSourceStageToCopy(this.processIndex, this.siteIndex, this.stageIndex);
    this.substanceFormSsg4mStagesService.setSourceResultingToCopy(this.resultingMaterialIndex);
    this.substanceFormSsg4mStagesService.copyResultingToStarting(this.processIndex, this.siteIndex, this.stageIndex + 1);
  }

  openAmountDialog(): void {
    if (!this.privateResultingMaterial.amount) {
      this.privateResultingMaterial.amount = {};
    }
    const dialogRef = this.dialog.open(AmountFormDialogComponent, {
      data: {'subsAmount': this.privateResultingMaterial.amount},
      width: '990px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newAmount => {
      this.overlayContainer.style.zIndex = null;
      this.privateResultingMaterial.amount = newAmount;
    });
    this.subscriptions.push(dialogSubscription);
  }

  displayAmount(amt: SubstanceAmount): string {
    return this.utilsService.displayAmount(amt);
  }

  fileSelected(file: File): void {
    this.error = false;
    if (file != null) {
      this.loading = true;
      this.utilsService.uploadFile(file).subscribe(response => {
        this.privateResultingMaterial.specificationReference = response;
        this.loading = false;

      }, error => {
        this.loading = false;
        this.error = true;

      });
    }
  }

  downloadDocument(url: string): void {
    this.substanceFormService.bypassUpdateCheck();
    window.open(url);
  }

  /*
  copyResultingToStarting() {
    let found = false;
    let resultMatRefUuid = '';
    let startMatRefUuid = '';
    const thisResultMatObj = this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].resultingMaterials[this.resultingMaterialIndex];
    const thisResultMatSubName = thisResultMatObj.substanceName;
    // Get Next Stage
    const nextStageObj = this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex + 1];
    // Get this Resulting Material refUuid from Substance Name
    if (thisResultMatSubName) {
      resultMatRefUuid = thisResultMatSubName.refuuid;
    }
    // If next Stage exists
    if (nextStageObj !== null && nextStageObj !== undefined) {
      if (nextStageObj.startingMaterials.length == 0) {
        // if there is no Starting Material, add a new one and copy
        this.copyToStartingFields();
      } else {
        // if Starting Material exists, loop through to find same refuuid
        nextStageObj.startingMaterials.forEach(element => {
          if (element) {
            // Get this Starting Material refUuid from Substance Name
            const startMatSubName = element.substanceName;
            if (startMatSubName) {
              startMatRefUuid = startMatSubName.refuuid;
              // If the refuuid for the Resulting Material is same as FIRST Starting Material in the next Stage
              if (resultMatRefUuid === startMatRefUuid) {
                found = true;
                alert('This Substance ' + startMatSubName.name + ' already exists in the Starting Material in the next Stage');
              }
            }
          }
        }); // for each Starting Material in next Stage
        if (found === false) {
          this.copyToStartingFields();
        }
      }
    }
    // Add a next Stage if it does not exists
    if (!nextStageObj) {
      this.addStage();
      this.copyToStartingFields();
    }
  }

  copyToStartingFields() {
    const thisResultMatObj = this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].resultingMaterials[this.resultingMaterialIndex];
    const thisResultMatSubName = thisResultMatObj.substanceName;
    // Add New Starting Material
    this.addStartingMaterial();
    // Next Stage and Next New Starting Material
    // Get Next Stage
    const nextStageObj = this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex + 1];
    // Get the last index or push/add/copy to the Starting Material at the Last
    const nextStartIndex = nextStageObj.startingMaterials.length-1;
    const nextStartMat = nextStageObj.startingMaterials[nextStartIndex];
    nextStartMat.substanceName = thisResultMatSubName;
    nextStartMat.verbatimName = thisResultMatObj.verbatimName;
    nextStartMat.substanceRole = thisResultMatObj.substanceRole;
    nextStartMat.comments = thisResultMatObj.comments;
  }

  addStage() {
    this.substanceFormSsg4mStagesService.addStage(this.processIndex, this.siteIndex);
    setTimeout(() => {
      //  this.scrollToService.scrollToElement(`substance-process-site-0`, 'center');
    });
  }

  addStartingMaterial() {
    // Add Starting Material in the next stage
    this.substanceFormSsg4mStagesService.addStartingMaterials(this.processIndex, this.siteIndex, this.stageIndex + 1);
    setTimeout(() => {
      //  this.scrollToService.scrollToElement(`substance-process-site-stage-startMat-0`, 'center');
    });
  }
  */
}
