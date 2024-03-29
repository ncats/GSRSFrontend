import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceProperty, SubstanceSummary, SubstanceRelated, SubstanceParameter } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { PropertyParameterDialogComponent } from '../property-parameter-dialog/property-parameter-dialog.component';
import { UtilsService } from '../../utils/utils.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent implements OnInit {
  deleteTimer: any;
  private privateProperty: SubstanceProperty;
  referencedSubstanceUuid: string;
  @Output() propertyDeleted = new EventEmitter<SubstanceProperty>();
  propertyNameList: Array<VocabularyTerm> = [];
  propertyTypeList: Array<VocabularyTerm> = [];
  private overlayContainer: HTMLElement;
  _nonNumeric: string;

  constructor(
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private overlayContainerService: OverlayContainer,
    private substanceFormService: SubstanceFormService
  ) { }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  @Input()
  set property(property: SubstanceProperty) {
    this.privateProperty = property;
    this.referencedSubstanceUuid = this.privateProperty.referencedSubstance && this.privateProperty.referencedSubstance.refuuid || '';
    if ( !this.privateProperty.value) {
      this.privateProperty.value = {};
    }
    if (this.property.value && this.property.value.nonNumericValue) {
      this._nonNumeric = this.property.value.nonNumericValue;
    }
  }

  get property(): SubstanceProperty {
    return this.privateProperty;
  }

  deleteProperty(): void {
    this.privateProperty.$$deletedCode = this.utilsService.newUUID();
    if ((!this.privateProperty.referencedSubstance || !this.privateProperty.referencedSubstance.refuuid)
      && !this.privateProperty.name
      && !this.privateProperty.type
    ) {
      this.deleteTimer = setTimeout(() => {
        this.propertyDeleted.emit(this.property);
      }, 2000);
    }
  }

  deleteParameter(id: number): void {
    this.property.parameters.splice(id, 1);
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateProperty.$$deletedCode;
  }

  updateAccess(access: Array<string>): void {
    this.property.access = access;
  }

  referencedSubstanceUpdated(substance: SubstanceSummary): void {
    if (substance !== null){
      const referencedSubstance: SubstanceRelated = {
        refPname: substance._name,
        name: substance._name,
        refuuid: substance.uuid,
        substanceClass: 'reference',
        approvalID: substance.approvalID
      };
      this.property.referencedSubstance = referencedSubstance;
    } else {
      this.property.referencedSubstance = null;
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
        if (this.property.parameters == null) {
          this.property.parameters = [];
        }
        if (isNew) {
          this.property.parameters.unshift(newParameter);
        } else {
          Object.keys(newParameter).forEach(key => {
            parameter[key] = newParameter[key];
          });
        }
      }
    });
  }

  openFeatureDialog() {
    const feature = {'name': this.property.name, 'siteRange': this.property.value.nonNumericValue};
    const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
      data: {'card': 'feature', 'link': [], 'feature': feature},
      width: '1048px',
      panelClass: 'subunit-dialog'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(features => {
      this.overlayContainer.style.zIndex = null;
      this.property.name = features.name || '';
      this.property.value.nonNumericValue = features.siteRange;
      this._nonNumeric = features.siteRange;
    });
  }

  validateRange() {
    try {
      this.substanceFormService.stringToSites(this._nonNumeric);
      this.property.value.nonNumericValue = this._nonNumeric;
    } catch (error) {
      alert('invalid shorthand for a site. Must be of form "{subunit}_{residue}" with multiple ranges seperated by a comma. Changes will be reverted');
      this._nonNumeric = this.property.value.nonNumericValue;
    }
  }

  addOtherOption(vocab: Array<VocabularyTerm>, property: string) {
    if (vocab.some(r => property === r.value)) {
    } else {
    }
    return vocab;
  }


}
