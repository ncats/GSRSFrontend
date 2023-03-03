import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ConfigService } from '@gsrs-core/config/config.service';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { SpecifiedSubstanceG4mProcessingMaterial, SubstanceAmount } from '@gsrs-core/substance/substance.model';
import { AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import { ConfirmDialogComponent } from '../../../fda/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ssg4m-processing-materials-form',
  templateUrl: './ssg4m-processing-materials-form.component.html',
  styleUrls: ['./ssg4m-processing-materials-form.component.scss']
})
export class Ssg4mProcessingMaterialsFormComponent implements OnInit, OnDestroy {

  @Input() processingMaterialIndex: number;
  privateProcessIndex: number;
  privateSiteIndex: number;
  privateStageIndex: number;
  public configSettingsDisplay = {};
  privateShowAdvancedSettings: boolean;
  privateProcessingMaterial: SpecifiedSubstanceG4mProcessingMaterial;
  relatedSubstanceUuid: string;
  substance: SubstanceDetail;
  private overlayContainer: HTMLElement;
  loading = false;
  error = false;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private overlayContainerService: OverlayContainer,
    private utilsService: UtilsService,
    public configService: ConfigService,
    private dialog: MatDialog
  ) { }

  @Input()
  set processingMaterial(startingMaterial: SpecifiedSubstanceG4mProcessingMaterial) {
    this.privateProcessingMaterial = startingMaterial;
  }

  get processingMaterial(): SpecifiedSubstanceG4mProcessingMaterial {
    return this.privateProcessingMaterial;
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
    if (this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].processingMaterials[this.processingMaterialIndex].substanceName) {
      let substanceRelated = this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].processingMaterials[this.processingMaterialIndex].substanceName;
      this.relatedSubstanceUuid = substanceRelated.refuuid;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getConfigSettings(): void {
    // Get SSG4 Config Settings from config.json file to show and hide fields in the form
    let configSsg4Form: any;
    configSsg4Form = this.configService.configData && this.configService.configData.ssg4Form || null;
    // *** IMPORTANT: get the correct value. Get 'processingMaterial' json values from config
    const confSettings = configSsg4Form.settingsDisplay.processingMaterial;
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
    this.privateProcessingMaterial.substanceRole = role;
  }

  updateSubstanceGrade(grade: string): void {
    this.privateProcessingMaterial.substanceGrade = grade;
  }

  updateSpecificationType(specificationType: string): void {
    this.privateProcessingMaterial.specificationType = specificationType;
  }

  updateAcceptanceCriteriaType(acceptanceCriteriaType: string): void {
    this.privateProcessingMaterial.acceptanceCriteriaType = acceptanceCriteriaType;
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
      this.privateProcessingMaterial.substanceName = relatedSubstance;
    }
    else {
      this.privateProcessingMaterial.substanceName = {};
    }
  }

  confirmDeleteProcessingMaterial() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Processing Material ' + (this.processingMaterialIndex + 1) + ' for Step ' + (this.stageIndex + 1) + ' for Site ' + (this.siteIndex + 1) + ' for Process ' + (this.processIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProcessingMaterial();
      }
    });
  }

  deleteProcessingMaterial(): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].processingMaterials.splice(this.processingMaterialIndex, 1);
  }

  openAmountDialog(): void {
    if (!this.privateProcessingMaterial.amount) {
      this.privateProcessingMaterial.amount = {};
    }
    const dialogRef = this.dialog.open(AmountFormDialogComponent, {
      data: {'subsAmount': this.privateProcessingMaterial.amount},
      width: '990px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newAmount => {
      this.overlayContainer.style.zIndex = null;
      this.privateProcessingMaterial.amount = newAmount;
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
        this.privateProcessingMaterial.specificationReference = response;
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

}
