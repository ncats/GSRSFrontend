import { Component, OnInit, Input } from '@angular/core';
import { SubstanceAmount } from '@gsrs-core/substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-amount-form',
  templateUrl: './amount-form.component.html',
  styleUrls: ['./amount-form.component.scss']
})
export class AmountFormComponent implements OnInit {
  private privateSubstanceAmount: SubstanceAmount;
  amountTypeList: Array<VocabularyTerm> = [];
  amountUnitList: Array<VocabularyTerm> = [];
  typeControl = new FormControl('', Validators.required);
  averageControl = new FormControl('');
  lowControl = new FormControl('');
  highControl = new FormControl('');
  lowLimitControl = new FormControl('');
  highLimitControl = new FormControl('');
  unitsControl = new FormControl('');
  nonNumericValueControl = new FormControl('');

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set substanceAmount(amount: SubstanceAmount) {
    if (amount != null) {
      this.privateSubstanceAmount = amount;

      this.typeControl.setValue(this.privateSubstanceAmount.type);
      this.typeControl.valueChanges.subscribe(value => {
        this.privateSubstanceAmount.type = value;
      });
      this.averageControl.setValue(this.privateSubstanceAmount.average);
      this.averageControl.valueChanges.subscribe(value => {
        if(value === null) {
          this.averageControl.setValue('');
        } else if(value.length === 1 && value.match(/[a-z]/i)) {
          this.averageControl.setValue('');
        } else if(value.match(/^[-E0-9,.]*$/)) { // what we want
        } else {
          this.averageControl.setValue('');
        }
        this.privateSubstanceAmount.average = value;
      });
      this.lowControl.setValue(this.privateSubstanceAmount.low);
      this.lowControl.valueChanges.subscribe(value => {
        if(value === null) {
          this.lowControl.setValue('');
        } else if(value.length === 1 && value.match(/[a-z]/i)) {
          this.lowControl.setValue('');
        } else if(value.match(/^[-E0-9,.]*$/)) { // what we want
        } else {
          this.lowControl.setValue('');
        }
        this.privateSubstanceAmount.low = value;
      });
      this.highControl.setValue(this.privateSubstanceAmount.high);
      this.highControl.valueChanges.subscribe(value => {
        if(value === null) {
          this.highControl.setValue('');
        } else if(value.length === 1 && value.match(/[a-z]/i)) {
          this.highControl.setValue('');
        } else if(value.match(/^[-E0-9,.]*$/)) { // what we want
        } else {
          this.highControl.setValue('');
        }
        this.privateSubstanceAmount.high = value;
      });
      this.lowLimitControl.setValue(this.privateSubstanceAmount.lowLimit);
      this.lowLimitControl.valueChanges.subscribe(value => {
        if(value === null) {
          this.lowLimitControl.setValue('');
        } else if(value.length === 1 && value.match(/[a-z]/i)) {
          this.lowLimitControl.setValue('');
        } else if(value.match(/^[-E0-9,.]*$/)) { // what we want
        } else {
          this.lowLimitControl.setValue('');
        }
        this.privateSubstanceAmount.lowLimit = value;
      });
      this.highLimitControl.setValue(this.privateSubstanceAmount.highLimit);
      this.highLimitControl.valueChanges.subscribe(value => {
        if(value === null) {
          this.highLimitControl.setValue('');
        } else if(value.length === 1 && value.match(/[a-z]/i)) {
          this.highLimitControl.setValue('');
        } else if(value.match(/^[-E0-9,.]*$/)) { // what we want
        } else {
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
