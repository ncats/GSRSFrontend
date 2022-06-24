import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FormControl, Validators } from '@angular/forms';
import { ConfigService } from '@gsrs-core/config/config.service';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { SubstanceFormPropertiesService } from '@gsrs-core/substance-form/properties/substance-form-properties.service';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { SubstanceRelated, SubstanceSummary, SubstanceProperty, SubstanceParameter } from '@gsrs-core/substance';
import { PropertyParameterDialogComponent } from '@gsrs-core/substance-form/property-parameter-dialog/property-parameter-dialog.component';
import { SpecifiedSubstanceG4mCriticalParameter, SubstanceAmount } from '@gsrs-core/substance/substance.model';
import { ConfirmDialogComponent } from '../../../fda/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ssg4m-critical-parameter-form',
  templateUrl: './ssg4m-critical-parameter-form.component.html',
  styleUrls: ['./ssg4m-critical-parameter-form.component.scss']
})
export class Ssg4mCriticalParameterFormComponent implements OnInit, OnDestroy {

  @Input() criticalParameterIndex: number;
  privateProcessIndex: number;
  privateSiteIndex: number;
  privateStageIndex: number;
  public configSettingsDisplay = {};
  privateShowAdvancedSettings: boolean;
  privateCriticalParameter: SpecifiedSubstanceG4mCriticalParameter;
  properties: Array<SubstanceProperty>;
  relatedSubstanceUuid: string;
  substance: SubstanceDetail;
  _nonNumeric: string;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];
  privateSubstanceAmount: SubstanceAmount;
  amountTypeList: Array<VocabularyTerm> = [];
  amountUnitList: Array<VocabularyTerm> = [];
  typeControl = new FormControl('');
  averageControl = new FormControl('');
  lowControl = new FormControl('');
  highControl = new FormControl('');
  lowLimitControl = new FormControl('');
  highLimitControl = new FormControl('');
  unitsControl = new FormControl('');
  nonNumericValueControl = new FormControl('');

  constructor(
    private substanceFormService: SubstanceFormService,
    private substanceFormPropertiesService: SubstanceFormPropertiesService,
    private cvService: ControlledVocabularyService,
    public configService: ConfigService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog
  ) { }

  @Input()
  set criticalParameter(criticalParameter: SpecifiedSubstanceG4mCriticalParameter) {
    this.privateCriticalParameter = criticalParameter;
  }

  get criticalParameter(): SpecifiedSubstanceG4mCriticalParameter {
    return this.privateCriticalParameter;
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

    this.overlayContainer = this.overlayContainerService.getContainerElement();
    if (!this.criticalParameter.value) {
      this.criticalParameter.value = {};
    }
    this.privateSubstanceAmount = this.criticalParameter.value;
    this.setSubstanceAmount();
    this.getVocabularies();
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
    // Get 'criteriaParameter' json values from config
    const confSettings = configSsg4Form.settingsDisplay.criteriaParameter;
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

  confirmDeleteCriticalParameter() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Critical Parameter ' + (this.criticalParameterIndex + 1) + ' for Stage ' + (this.stageIndex + 1) + ' for Site ' + (this.siteIndex + 1) + ' for Process ' + (this.processIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteCriticalParameter();
      }
    });
  }

  deleteCriticalParameter(): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].criticalParameters.splice(this.criticalParameterIndex, 1);
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

      //   this.privateCriticalParameter.substanceName = relatedSubstance;
    }
  }

  openPropertyParameter(parameter?: SubstanceParameter): void {
    let isNew: boolean;
    if (parameter == null) {
      isNew = true;
      parameter = { value: {} };
    }
    const parameterCopyString = JSON.stringify(parameter);

    const dialogRef = this.dialog.open(PropertyParameterDialogComponent, {
      data: JSON.parse(parameterCopyString),
      width: '1200px'
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(newParameter => {
      this.overlayContainer.style.zIndex = null;
      if (newParameter != null) {
        if (this.criticalParameter.parameters == null) {
          this.criticalParameter.parameters = [];
        }
        if (isNew) {
          this.criticalParameter.parameters.unshift(newParameter);
        } else {
          Object.keys(newParameter).forEach(key => {
            parameter[key] = newParameter[key];
          });
        }
      }
    });
  }

  deleteParameter(id: number): void {
    this.criticalParameter.parameters.splice(id, 1);
  }

  setSubstanceAmount() {
    this.typeControl.setValue(this.privateSubstanceAmount.type);
    this.typeControl.valueChanges.subscribe(value => {
      this.privateSubstanceAmount.type = value;
    });
    this.averageControl.setValue(this.privateSubstanceAmount.average);
    this.averageControl.valueChanges.subscribe(value => {
      if (value === null) {
        this.averageControl.setValue('');
      } else if (value.length === 1 && value.match(/[a-z]/i)) {
        this.averageControl.setValue('');
      }
      this.privateSubstanceAmount.average = value;
    });
    this.lowControl.setValue(this.privateSubstanceAmount.low);
    this.lowControl.valueChanges.subscribe(value => {
      if (value === null) {
        this.lowControl.setValue('');
      } else if (value.length === 1 && value.match(/[a-z]/i)) {
        this.lowControl.setValue('');
      }
      this.privateSubstanceAmount.low = value;
    });
    this.highControl.setValue(this.privateSubstanceAmount.high);
    this.highControl.valueChanges.subscribe(value => {
      if (value === null) {
        this.highControl.setValue('');
      } else if (value.length === 1 && value.match(/[a-z]/i)) {
        this.highControl.setValue('');
      }
      this.privateSubstanceAmount.high = value;
    });
    this.lowLimitControl.setValue(this.privateSubstanceAmount.lowLimit);
    this.lowLimitControl.valueChanges.subscribe(value => {
      if (value === null) {
        this.lowLimitControl.setValue('');
      } else if (value.length === 1 && value.match(/[a-z]/i)) {
        this.lowLimitControl.setValue('');
      }
      this.privateSubstanceAmount.lowLimit = value;
    });
    this.highLimitControl.setValue(this.privateSubstanceAmount.highLimit);
    this.highLimitControl.valueChanges.subscribe(value => {
      if (value === null) {
        this.highLimitControl.setValue('');
      } else if (value.length === 1 && value.match(/[a-z]/i)) {
        this.highLimitControl.setValue('');
      }
      this.privateSubstanceAmount.highLimit = value;
    });
    this.unitsControl.setValue(this.privateSubstanceAmount.units);
    this.unitsControl.valueChanges.subscribe(value => {
      this.privateSubstanceAmount.units = value;
    });
    this.nonNumericValueControl.setValue(this.privateSubstanceAmount.nonNumericValue);
    this.nonNumericValueControl.valueChanges.subscribe(value => {
      this.privateSubstanceAmount.nonNumericValue = value;
    });
  }

  get substanceAmount(): SubstanceAmount {
    return this.privateSubstanceAmount;
  }

  updateAccess(access: Array<string>): void {
    this.privateSubstanceAmount.access = access;
    this.substanceAmount.access = access;
  }

  updateType(event: any) {
    setTimeout(() => {
      this.typeControl.setValue(event.value);
    });
    this.privateSubstanceAmount.type = event.value;
  }

  updateUnits(event: any) {
    setTimeout(() => {
      this.unitsControl.setValue(event.value);
    });
    this.privateSubstanceAmount.units = event.value;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('AMOUNT_TYPE', 'AMOUNT_UNIT').subscribe(response => {
      this.amountTypeList = response['AMOUNT_TYPE'].list;
      this.amountUnitList = response['AMOUNT_UNIT'].list;
    });
  }

  inCV(vocab: Array<VocabularyTerm>, property: string) {
    return vocab.some(r => property === r.value);
  }
}
