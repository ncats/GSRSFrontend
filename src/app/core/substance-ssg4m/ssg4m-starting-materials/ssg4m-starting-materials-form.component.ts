import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ConfigService } from '@gsrs-core/config/config.service';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { SpecifiedSubstanceG4mStartingMaterial, SubstanceAmount } from '@gsrs-core/substance/substance.model';
import { AmountFormDialogComponent } from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import { ConfirmDialogComponent } from '../../../fda/confirm-dialog/confirm-dialog.component';
import { SubstanceFormSsg4mStagesService } from '../ssg4m-stages/substance-form-ssg4m-stages.service';

@Component({
  selector: 'app-ssg4m-starting-materials-form',
  templateUrl: './ssg4m-starting-materials-form.component.html',
  styleUrls: ['./ssg4m-starting-materials-form.component.scss']
})
export class Ssg4mStartingMaterialsFormComponent implements OnInit, OnDestroy {

  @Input() startingMaterialIndex: number;
  privateProcessIndex: number;
  privateSiteIndex: number;
  privateStageIndex: number;
  public configSettingsDisplay = {};
  privateShowAdvancedSettings: boolean;
  privateStartingMaterial: SpecifiedSubstanceG4mStartingMaterial;
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
  set startingMaterial(startingMaterial: SpecifiedSubstanceG4mStartingMaterial) {
    this.privateStartingMaterial = startingMaterial;
  }

  get startingMaterial(): SpecifiedSubstanceG4mStartingMaterial {
    return this.privateStartingMaterial;
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
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
    });
    this.subscriptions.push(subscription);

    // Load Substance Name
    if (this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].startingMaterials[this.startingMaterialIndex].substanceName) {
      let substanceRelated = this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].startingMaterials[this.startingMaterialIndex].substanceName;
      this.relatedSubstanceUuid = substanceRelated.refuuid;
    }

    if (this.configSettingsDisplay["references"] === true) {
      if (this.privateStartingMaterial.references == null) {
        this.privateStartingMaterial.references = [];
      }
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
    // *** IMPORTANT: get the correct value. Get 'startingMaterial' json values from config
    const confSettings = configSsg4Form.settingsDisplay.startingMaterial;
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
    this.privateStartingMaterial.substanceRole = role;
  }

  updateSubstanceGrade(grade: string): void {
    this.privateStartingMaterial.substanceGrade = grade;
  }

  updateSpecificationType(specificationType: string): void {
    this.privateStartingMaterial.specificationType = specificationType;
  }

  updateManufacturerIdType(manufacturerIndex: number, manufacturerIdType: string): void {
    this.privateStartingMaterial.manufacturerDetails[manufacturerIndex].manufacturerIdType = manufacturerIdType;
  }

  updateAcceptanceCriteriaType(acceptanceCriteriaType: string, acceptanceIndex: string): void {
    this.privateStartingMaterial.acceptanceCriterias[acceptanceIndex].acceptanceCriteriaType = acceptanceCriteriaType;
  }

  addManufacturer(processIndex: number, siteIndex: number, stageIndex: number) {
    this.substanceFormSsg4mStagesService.addStartingManufacturerDetails(processIndex, siteIndex, stageIndex, this.startingMaterialIndex);
  }

  addAcceptanceCriteria(processIndex: number, siteIndex: number, stageIndex: number) {
    this.substanceFormSsg4mStagesService.addStartingAcceptanceCriteria(processIndex, siteIndex, stageIndex, this.startingMaterialIndex);
  }

  relatedSubstanceUpdated(substance: SubstanceSummary): void {
    if (substance !== null) {
      const relatedSubstance: SubstanceRelated = {
        refPname: substance._name,
        name: substance._name,
        refuuid: substance.uuid,
        substanceClass: 'reference',
        approvalID: substance.approvalID
      };
      this.privateStartingMaterial.substanceName = relatedSubstance;
    } else {
      this.privateStartingMaterial.substanceName = {};
    }
  }

  confirmDeleteStartingMaterial() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Input Material ' + (this.startingMaterialIndex + 1) + ' for Step ' + (this.stageIndex + 1) + ' for Site ' + (this.siteIndex + 1) + ' for Process ' + (this.processIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteStartingMaterial();
      }
    });
  }

  deleteStartingMaterial(): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].startingMaterials.splice(this.startingMaterialIndex, 1);
  }

  confirmDeleteManufacturer(manufacturerIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Manufacturer ' + (manufacturerIndex + 1) + ' for Starting Material ' + (this.startingMaterialIndex + 1) + ' for Step ' + (this.stageIndex + 1) + ' for Site ' + (this.siteIndex + 1) + ' for Process ' + (this.processIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteManufacturer(manufacturerIndex);
      }
    });
  }

  deleteManufacturer(manufacturerIndex: number): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].startingMaterials[this.startingMaterialIndex].manufacturerDetails.splice(manufacturerIndex, 1);
  }

  confirmDeleteAcceptanceCriteria(acceptanceIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Acceptance Criteria ' + (acceptanceIndex + 1) + ' for Starting Material ' + (this.startingMaterialIndex + 1) + ' for Step ' + (this.stageIndex + 1) + ' for Site ' + (this.siteIndex + 1) + ' for Process ' + (this.processIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteAcceptanceCriteria(acceptanceIndex);
      }
    });
  }

  deleteAcceptanceCriteria(acceptanceIndex: number): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].startingMaterials[this.startingMaterialIndex].acceptanceCriterias.splice(acceptanceIndex, 1);
  }

  openAmountDialog(): void {
    if (!this.privateStartingMaterial.amount) {
      this.privateStartingMaterial.amount = {};
    }
    const dialogRef = this.dialog.open(AmountFormDialogComponent, {
      data: { 'subsAmount': this.privateStartingMaterial.amount },
      width: '990px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newAmount => {
      this.overlayContainer.style.zIndex = null;
      this.privateStartingMaterial.amount = newAmount;
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
        this.privateStartingMaterial.specificationReference = response;
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

  copyResultingToStarting(processIndex: number, siteIndex: number, stageIndex: number) {

  }

}
