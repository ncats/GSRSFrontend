import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../../substance-form/base-classes/substance-form-service-base';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { Observable } from 'rxjs';
import { SpecifiedSubstanceG4mProcess } from '@gsrs-core/substance/substance.model';

@Injectable()
export class SubstanceFormSsg4mProcessService extends SubstanceFormServiceBase<SpecifiedSubstanceG4mProcess> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      alert(this.substance);
      if (!this.substance.specifiedSubstanceG4m) {
        this.substance.specifiedSubstanceG4m = {};
      }
      if (!this.substance.specifiedSubstanceG4m.process) {
        this.substance.specifiedSubstanceG4m.process = [];
      }
      this.substanceFormService.resetState();
  //    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
    });
    this.subscriptions.push(subscription);
  }

  //get specifiedSubstanceG4mProcess(): Observable<Array<SpecifiedSubstanceG4mProcess>> {
  //  return this.propertyEmitter.asObservable();
 // }
}
