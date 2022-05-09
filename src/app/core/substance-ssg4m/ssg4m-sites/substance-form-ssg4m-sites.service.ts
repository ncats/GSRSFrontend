import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubstanceFormServiceBase } from '../../substance-form/base-classes/substance-form-service-base';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SpecifiedSubstanceG4mSite, SpecifiedSubstanceG4mStage } from '@gsrs-core/substance/substance.model';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class SubstanceFormSsg4mSitesService extends SubstanceFormServiceBase<Array<SpecifiedSubstanceG4mSite>> {

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

  get specifiedSubstanceG4mSite(): Observable<Array<SpecifiedSubstanceG4mSite>> {
    return this.propertyEmitter.asObservable();
  }

  addSite(processIndex): void {
    const newSite: SpecifiedSubstanceG4mSite = {
     // references: [],
     // access: [],
      siteName: '',
      stages: []
    };
    this.substance.specifiedSubstanceG4m.process[processIndex].sites.push(newSite);
    this.propertyEmitter.next( this.substance.specifiedSubstanceG4m.process[processIndex].sites);
  }

  deleteSite(site: SpecifiedSubstanceG4mSite): void {
    /*
    const siteIndex = this.substance.specifiedSubstanceG4m.process.findIndex(pro => pro.$$deletedCode === pro.$$deletedCode);
    if (processIndex > -1) {
      this.substance.specifiedSubstanceG4m.process.splice(processIndex, 1);
      this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
    }*/
  }

}
