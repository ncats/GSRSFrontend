import { Injectable } from '@angular/core';
import { SubstanceFormConstituentsModule } from './substance-form-constituents.module';
import { SubstanceFormService } from '../substance-form.service';
import { Observable } from 'rxjs';
import { Constituent } from '@gsrs-core/substance/substance.model';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';

@Injectable()
export class SubstanceFormConstituentsService extends SubstanceFormServiceBase<Array<Constituent>> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.specifiedSubstance.constituents == null) {
        this.substance.specifiedSubstance.constituents = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.specifiedSubstance.constituents);
    });
    this.subscriptions.push(subscription);
  }

  get substanceConstituents(): Observable<Array<Constituent>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceConstituent(): void {
    const constituent: Constituent = {references:[]};
    this.substance.specifiedSubstance.constituents.unshift(constituent);
    this.propertyEmitter.next(this.substance.specifiedSubstance.constituents);
  }

  deleteSubstanceConstituent(sugar: Constituent): void {
    const constituentIndex = this.substance.specifiedSubstance.constituents.findIndex(
      subCode => sugar.$$deletedCode === subCode.$$deletedCode);
    if (constituentIndex > -1) {
      this.substance.specifiedSubstance.constituents.splice(constituentIndex, 1);
      this.propertyEmitter.next(this.substance.specifiedSubstance.constituents);
    }
  }
}
