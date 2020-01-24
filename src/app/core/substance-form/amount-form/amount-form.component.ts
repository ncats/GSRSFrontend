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
        this.privateSubstanceAmount.average = value;
      });
      this.lowControl.setValue(this.privateSubstanceAmount.low);
      this.lowControl.valueChanges.subscribe(value => {
        this.privateSubstanceAmount.low = value;
      });
      this.highControl.setValue(this.privateSubstanceAmount.high);
      this.highControl.valueChanges.subscribe(value => {
        this.privateSubstanceAmount.high = value;
      });
      this.lowLimitControl.setValue(this.privateSubstanceAmount.lowLimit);
      this.lowLimitControl.valueChanges.subscribe(value => {
        this.privateSubstanceAmount.lowLimit = value;
      });
      this.highLimitControl.setValue(this.privateSubstanceAmount.highLimit);
      this.highLimitControl.valueChanges.subscribe(value => {
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

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('AMOUNT_TYPE', 'AMOUNT_UNIT').subscribe(response => {
      this.amountTypeList = response['AMOUNT_TYPE'].list;
      this.amountUnitList = response['AMOUNT_UNIT'].list;
    });
  }

}
