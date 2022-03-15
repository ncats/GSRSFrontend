import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubstanceFormServiceBase } from '../../substance-form/base-classes/substance-form-service-base';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SpecifiedSubstanceG4mStage } from '@gsrs-core/substance/substance.model';

@Injectable({
  providedIn: 'root'
})
export class SubstanceFormSsg4mStagesService extends SubstanceFormServiceBase<Array<SpecifiedSubstanceG4mStage>> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (!this.substance.specifiedSubstanceG4m) {
        this.substance.specifiedSubstanceG4m = {};
      }
      if (!this.substance.specifiedSubstanceG4m.process) {
        this.substance.specifiedSubstanceG4m.process = [{sites:[]}];
      }
      if (!this.substance.specifiedSubstanceG4m.process) {
        this.substance.specifiedSubstanceG4m.process = [{sites:[]}];
      }

      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
    });
    this.subscriptions.push(subscription);
  }

  get specifiedSubstanceG4mStage(): Observable<Array<SpecifiedSubstanceG4mStage>> {
    return this.propertyEmitter.asObservable();
  }

  addStage(processIndex: number, siteIndex: number): void {
    const newStage: SpecifiedSubstanceG4mStage = {
      references: [],
      access: []
    };
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.unshift(newStage);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
    //  this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites);
  }

}
