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
        this.substance.specifiedSubstanceG4m.process = [{ sites: [] }];
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
      stageNumber: '',
      criticalParameters: [],
      startingMaterials: [],
      processingMaterials: [],
      resultingMaterials: []
    };
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.push(newStage);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages);

    // When adding a new Stage, and if there is Substance Name in the previous Resulting Material, copy/add to
    // Starting Material in the new Stage.
    // Get the last index or push/add/copy to the Starting Material at the Last
    // Get New/Next Stage
    const lastStageIndex = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.length - 2;
    // Get Last Stage to copy Resulting Materials
    if (lastStageIndex >= 0) {
      const lastStageObj = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[lastStageIndex];
      const lastResultIndex = lastStageObj.resultingMaterials.length - 1;
      this.copyResultingToStarting(processIndex, siteIndex, lastStageIndex, lastResultIndex);
    }
  }

  addCriticalParameter(processIndex: number, siteIndex: number, stageIndex: number): void {
    const newCriticalParam: SpecifiedSubstanceG4mCriticalParameter = { value: {} };
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].criticalParameters.push(newCriticalParam);
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

  copyResultingToStarting(processIndex: number, siteIndex: number, stageIndex: number, resultingMaterialIndex: number) {
    let found = false;
    let resultMatRefUuid = '';
    let startMatRefUuid = '';
    if (this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].resultingMaterials.length > 0) {
      // Get this/current Resulting Material Object
      const thisResultMatObj = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].resultingMaterials[resultingMaterialIndex];
      const thisResultMatSubName = thisResultMatObj.substanceName;
      // Get this Resulting Material refUuid from Substance Name
      if (thisResultMatSubName) {
        resultMatRefUuid = thisResultMatSubName.refuuid;
      }
      // Get Next Stage
      const nextStageObj = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex + 1];

      // If next Stage exists
      if (nextStageObj !== null && nextStageObj !== undefined) {
        if (nextStageObj.startingMaterials.length == 0) {
          // if there is no Starting Material, add a new one and copy
          this.copyToStartingFields(processIndex, siteIndex, stageIndex, resultingMaterialIndex);
        } else {
          // if Starting Material exists, loop through to find same refuuid
          nextStageObj.startingMaterials.forEach(element => {
            if (element) {
              // Get this Starting Material refUuid from Substance Name
              const startMatSubName = element.substanceName;
              if (startMatSubName) {
                startMatRefUuid = startMatSubName.refuuid;
                // If the refuuid for the Resulting Material is same as FIRST Starting Material in the next Stage
                if (resultMatRefUuid === startMatRefUuid) {
                  found = true;
                  alert('This Substance ' + startMatSubName.name + ' already exists in the Starting Material in the next Stage');
                }
              }
            }
          }); // for each Starting Material in next Stage
          if (found === false) {
            this.copyToStartingFields(processIndex, siteIndex, stageIndex, resultingMaterialIndex);
          }
        }
      }
      // Add a next Stage if it does not exists
      if (!nextStageObj) {
        // this.addStage(processIndex, siteIndex);
        const newStage: SpecifiedSubstanceG4mStage = {
          stageNumber: '',
          criticalParameters: [],
          startingMaterials: [],
          processingMaterials: [],
          resultingMaterials: []
        };
        this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.push(newStage);
        this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages);

        this.copyToStartingFields(processIndex, siteIndex, stageIndex, resultingMaterialIndex);
      }
    } // if this/current Resulting Material > 0
  }

  copyToStartingFields(processIndex: number, siteIndex: number, stageIndex: number, resultingMaterialIndex: number) {
    // Get this Resulting Material Object
    const thisResultMatObj = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].resultingMaterials[resultingMaterialIndex];
    const thisResultMatSubName = thisResultMatObj.substanceName;
    // Add New Starting Material in the NEXT stage
    this.addStartingMaterials(processIndex, siteIndex, stageIndex + 1);
    // Next Stage and Next New Starting Material
    // Get Next Stage
    const nextStageObj = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex + 1];
    // Get the last index or push/add/copy to the Starting Material at the Last
    const nextStartIndex = nextStageObj.startingMaterials.length - 1;
    const nextStartMat = nextStageObj.startingMaterials[nextStartIndex];
    nextStartMat.substanceName = thisResultMatSubName;
    nextStartMat.verbatimName = thisResultMatObj.verbatimName;
    nextStartMat.substanceRole = thisResultMatObj.substanceRole;
    nextStartMat.comments = thisResultMatObj.comments;
  }
}
