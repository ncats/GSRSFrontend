import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubstanceFormServiceBase } from '../../substance-form/base-classes/substance-form-service-base';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SpecifiedSubstanceG2Manufacturing } from '@gsrs-core/substance/substance.model';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class SubstanceFormSsg2ManufacturingService extends SubstanceFormServiceBase<Array<SpecifiedSubstanceG2Manufacturing>> {

  constructor(
    public substanceFormService: SubstanceFormService
    //private substanceFormSsg4mSitesService: SubstanceFormSsg4mSitesService,
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (!this.substance.specifiedSubstanceG2) {
        this.substance.specifiedSubstanceG2 = {};
      }
      if (!this.substance.specifiedSubstanceG2.manufacturing) {
        this.substance.specifiedSubstanceG2.manufacturing = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.specifiedSubstanceG2.manufacturing);
    });
    this.subscriptions.push(subscription);
  }

  get specifiedSubstanceG2Manufacturing(): Observable<Array<SpecifiedSubstanceG2Manufacturing>> {
    return this.propertyEmitter.asObservable();
  }

  addManufacturing(): void {
    const newManufacturing: SpecifiedSubstanceG2Manufacturing = {};
    this.substance.specifiedSubstanceG2.manufacturing.unshift(newManufacturing);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG2.manufacturing);
  }

  deleteManufacturing(manufactureIndex: number): void {
    // const processIndex = this.substance.specifiedSubstanceG4m.process.findIndex(pro => pro.$$deletedCode === pro.$$deletedCode);
  //   if (processIndex > -1) {
       this.substance.specifiedSubstanceG2.manufacturing.splice(manufactureIndex, 1);
       this.propertyEmitter.next(this.substance.specifiedSubstanceG2.manufacturing);
  //   }
   }

}
