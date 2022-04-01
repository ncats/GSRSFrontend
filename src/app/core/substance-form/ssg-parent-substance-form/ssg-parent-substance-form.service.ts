import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { Observable } from 'rxjs';
import { SpecifiedSubstanceParent } from '@gsrs-core/substance/substance.model';

@Injectable()
export class SsgParentSubstanceFormService extends SubstanceFormServiceBase<SpecifiedSubstanceParent> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (!this.substance.specifiedSubstanceG4m.parentSubstance) {
        this.substance.specifiedSubstanceG4m.parentSubstance = {};
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.parentSubstance);
    });
    this.subscriptions.push(subscription);
  }

  get parentSubstance(): Observable<SpecifiedSubstanceParent> {
    return this.propertyEmitter.asObservable();
  }
}
