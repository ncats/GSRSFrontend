import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceProperty, SubstanceSummary, SubstanceRelated, MediatorSubstance } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent implements OnInit {
  isDeleted = false;
  private privateProperty: SubstanceProperty;
  referencedSubstanceUuid: string;
  @Output() propertyDeleted = new EventEmitter<SubstanceProperty>();
  propertyNameList: Array<VocabularyTerm> = [];
  propertyNameControl = new FormControl('');
  propertyTypeList: Array<VocabularyTerm> = [];
  propertyTypeControl = new FormControl('');

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set property(property: SubstanceProperty) {
    this.privateProperty = property;
    this.referencedSubstanceUuid = this.privateProperty.referencedSubstance && this.privateProperty.referencedSubstance.uuid || '';
    this.propertyNameControl.setValue(this.property.name);
    this.propertyNameControl.valueChanges.subscribe(value => {
      this.property.name = value;
    });
    this.propertyTypeControl.setValue(this.property.type);
    this.propertyTypeControl.valueChanges.subscribe(value => {
      this.property.type = value;
    });
  }

  get property(): SubstanceProperty {
    return this.privateProperty;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('PROPERTY_NAME', 'PROPERTY_TYPE').subscribe(response => {
      this.propertyNameList = response['PROPERTY_NAME'].list;
      this.propertyTypeList = response['PROPERTY_TYPE'].list;
    });
  }

  deleteProperty(): void {
    this.isDeleted = true;
    setTimeout(() => {
      this.propertyDeleted.emit(this.property);
    }, 500);
  }

  updateAccess(access: Array<string>): void {
    this.property.access = access;
  }

  referencedSubstanceUpdated(substance: SubstanceSummary): void {
    const referencedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.property.referencedSubstance = referencedSubstance;
  }

  updateDefining(event: MatCheckboxChange): void {
    this.property.defining = event.checked;
  }

}
