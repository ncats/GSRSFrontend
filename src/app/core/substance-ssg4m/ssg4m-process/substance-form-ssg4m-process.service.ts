import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubstanceFormServiceBase } from '../../substance-form/base-classes/substance-form-service-base';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SubstanceFormSsg4mSitesService } from '../ssg4m-sites/substance-form-ssg4m-sites.service';
import { SpecifiedSubstanceG4mProcess, SpecifiedSubstanceG4mSite } from '@gsrs-core/substance/substance.model';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class SubstanceFormSsg4mProcessService extends SubstanceFormServiceBase<Array<SpecifiedSubstanceG4mProcess>> {

  constructor(
    public substanceFormService: SubstanceFormService,
    private substanceFormSsg4mSitesService: SubstanceFormSsg4mSitesService,
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
        this.substance.specifiedSubstanceG4m.process = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
    });
    this.subscriptions.push(subscription);
  }

  get specifiedSubstanceG4mProcess(): Observable<Array<SpecifiedSubstanceG4mProcess>> {
    return this.propertyEmitter.asObservable();
  }

  addProcess(): void {
    const newProcess: SpecifiedSubstanceG4mProcess = {
      processName: 'Process ',
      sites:[{stages:[{"stageNumber": "Stage 1",
      startingMaterials: [],
      processingMaterials: [],
      resultingMaterials: [],
      criticalParameters: []}]}]
    };
    const processIndex = this.substance.specifiedSubstanceG4m.process.push(newProcess);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
    //Add Site
    this.substanceFormSsg4mSitesService.addSite(processIndex-1);
  }

  deleteProcess(process: SpecifiedSubstanceG4mProcess, processIndex: number): void {
    // const processIndex = this.substance.specifiedSubstanceG4m.process.findIndex(pro => pro.$$deletedCode === pro.$$deletedCode);
     if (processIndex > -1) {
       this.substance.specifiedSubstanceG4m.process.splice(processIndex, 1);
       this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
     }
   }

   addSite(processIndex: number): void {

   }

   /*
  addSite(processIndex: number): void {
    const newSite: SpecifiedSubstanceG4mSite = {
    //  references: [],
    //  access: [],
    stages: []
    };
    this.substance.specifiedSubstanceG4m.process[processIndex].sites.unshift(newSite);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
  }
  */
}
