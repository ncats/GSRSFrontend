import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubstanceFormServiceBase } from '../../substance-form/base-classes/substance-form-service-base';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SpecifiedSubstanceG4mCriticalParameter, SpecifiedSubstanceG4mStage, SpecifiedSubstanceG4mStartingMaterial } from '@gsrs-core/substance/substance.model';
import { SpecifiedSubstanceG4mProcessingMaterial, SpecifiedSubstanceG4mResultingMaterial } from '@gsrs-core/substance/substance.model';

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

  addCriticalParameter(processIndex: number, siteIndex: number, stageIndex: number): void {
    const newCriticalParam: SpecifiedSubstanceG4mCriticalParameter = {};
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].criticalParameters.push(newCriticalParam);
    alert('RRRRRR ' + JSON.stringify( this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].criticalParameters));
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].criticalParameters);
  }

  addStartingMaterials(processIndex: number, siteIndex: number, stageIndex: number): void {
    const newStartMat: SpecifiedSubstanceG4mStartingMaterial = {};
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].startingMaterials.push(newStartMat);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].startingMaterials);
  }

  addProcessingMaterials(processIndex: number, siteIndex: number, stageIndex: number): void {
    const newProcessMat: SpecifiedSubstanceG4mProcessingMaterial = {};
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].processingMaterials.push(newProcessMat);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].processingMaterials);
  }

  addResultingMaterials(processIndex: number, siteIndex: number, stageIndex: number): void {
    const newResultingMat: SpecifiedSubstanceG4mResultingMaterial = {};
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].resultingMaterials.push(newResultingMat);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].resultingMaterials);
  }

  /*
  addStage(processIndex: number, siteIndex: number): void {
    const newStage: SpecifiedSubstanceG4mStage = {
     // references: [],
    //  access: []
    startingMaterials: [],
    processingMaterials: [],
    resultingMaterials: []
    };
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.unshift(newStage);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
    //  this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites);
  }
  */
}
