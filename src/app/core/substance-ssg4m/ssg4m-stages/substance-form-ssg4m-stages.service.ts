import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubstanceFormServiceBase } from '../../substance-form/base-classes/substance-form-service-base';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SpecifiedSubstanceG4mCriticalParameter, SpecifiedSubstanceG4mStage, SpecifiedSubstanceG4mStartingMaterial } from '@gsrs-core/substance/substance.model';
import { SpecifiedSubstanceG4mProcessingMaterial, SpecifiedSubstanceG4mResultingMaterial } from '@gsrs-core/substance/substance.model';
import { SubstanceFormSsg4mResultingMaterialsModule } from '../ssg4m-resulting-materials/substance-form-ssg4m-resulting-materials.module';

@Injectable({
  providedIn: 'root'
})
export class SubstanceFormSsg4mStagesService extends SubstanceFormServiceBase<Array<SpecifiedSubstanceG4mStage>> {
  sourceStageToCopy: SpecifiedSubstanceG4mStage;
  sourceStartingMatObj: SpecifiedSubstanceG4mStartingMaterial;
  sourceStartingMatRefUuid: string;
  sourceResultingMatObj: SpecifiedSubstanceG4mResultingMaterial;
  sourceResultingMatRefUuid: string;
  sourceResultingMatList: Array<SpecifiedSubstanceG4mResultingMaterial>;

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

  addCriticalParameter(processIndex: number, siteIndex: number, stageIndex: number): void {
    const newCriticalParam: SpecifiedSubstanceG4mCriticalParameter = { value: {} };
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].criticalParameters.push(newCriticalParam);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].criticalParameters);
  }

  addStartingMaterials(processIndex: number, siteIndex: number, stageIndex: number): void {
    const newStartMat: SpecifiedSubstanceG4mStartingMaterial = { substanceRole: 'Starting Material' };
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].startingMaterials.push(newStartMat);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].startingMaterials);
  }

  addProcessingMaterials(processIndex: number, siteIndex: number, stageIndex: number): void {
    const newProcessMat: SpecifiedSubstanceG4mProcessingMaterial = { substanceRole: 'Solvent' };
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].processingMaterials.push(newProcessMat);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].processingMaterials);
  }

  addResultingMaterials(processIndex: number, siteIndex: number, stageIndex: number): void {
    const newResultingMat: SpecifiedSubstanceG4mResultingMaterial = { substanceRole: 'Intermediate' };
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].resultingMaterials.push(newResultingMat);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex].resultingMaterials);
  }

  addStage(processIndex: number, siteIndex: number): void {
    const stageIndex = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.length - 1;
    const newStageIndex = (stageIndex + 2).toString();

    const newStage: SpecifiedSubstanceG4mStage = {
      stageNumber: newStageIndex,
      criticalParameters: [],
      startingMaterials: [],
      processingMaterials: [],
      resultingMaterials: []
    };

    // Get Current/Source Stage to Copy (Resulting Material -> Starting Material) to New Stage
    // Set the previous Stage to copy to new Stage, if there is at least one stages
    // When adding a new Stage, and if there is Substance Name in the previous Resulting Material, copy/add to
    // Starting Material in the new Stage.
    // Get the last index or push/add/copy to the Starting Material at the Last
    // Get New/Next Stage

    if (stageIndex >= 0) {
      this.setSourceStageToCopy(processIndex, siteIndex, stageIndex);

      // If Substance Name exists in Resulting Materials in Current/Source Stage, then copy to Starting Material in next/new Stage
      // If new Stage is first one in the list, do not copy Resulting Material
      this.setSourceResultingToCopy();
    }

    // Add new Stage at the end of the list
    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.push(newStage);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages);

    //if (this.sourceResultingMatObj && this.sourceResultingMatRefUuid) {
    if (this.sourceResultingMatList.length > 0) {
      this.copyResultingToStarting(processIndex, siteIndex, stageIndex + 1);
    }
  }

  insertStage(processIndex: number, siteIndex: number, stageIndex: number, insertDirection?: string): void {
    const newStage: SpecifiedSubstanceG4mStage = {
      stageNumber: '',
      criticalParameters: [],
      startingMaterials: [],
      processingMaterials: [],
      resultingMaterials: []
    };

    // Get Current/Source Stage to Copy (Resulting Material -> Starting Material) to New Stage
    this.setSourceStageToCopy(processIndex, siteIndex, stageIndex);

    // Insert/Add New Stage, before or after the current/source Stage
    let newStageIndex = 0;
    if (insertDirection && insertDirection === 'before') {
      this.setSourceStartingToCopy();
      newStageIndex = stageIndex;
      // this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.splice(newStageIndex, 0, newStage);
      // stageIndexNew = stageIndex;
    } else { // after
      this.setSourceResultingToCopy();
      newStageIndex = stageIndex + 1;
      // this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.splice(newStageIndex, 0, newStage);
      // stageIndexNew = stageIndex + 1;
    }

    this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.splice(newStageIndex, 0, newStage);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages);

    if ((this.sourceStartingMatObj && this.sourceStartingMatRefUuid && newStageIndex >= 0) && (insertDirection && insertDirection === 'before')) {
      this.copyStartingToResulting(processIndex, siteIndex, newStageIndex);

      // if Inserting before, and the current Stage is not the first Stage, copy the Resulting Material to Starting Material in new stage.
      if ((stageIndex >= 1) && (insertDirection && insertDirection === 'before')) {
        // Get Current/Source Stage to Copy (Resulting Material -> Starting Material) to New Stage
        this.setSourceStageToCopy(processIndex, siteIndex, newStageIndex - 1);
        this.setSourceResultingToCopy();
        this.copyResultingToStarting(processIndex, siteIndex, newStageIndex);
      }
    }

    // If Substance Name exists in Resulting Materials in Current/Source Stage, then copy to Starting Material in next/new Stage
    // If new Stage is first one in the list, do not copy Resulting Material
 //   if ((this.sourceResultingMatObj && this.sourceResultingMatRefUuid && newStageIndex > 0) && (insertDirection && insertDirection === 'after')) {
    if ((this.sourceResultingMatList.length > 0 && newStageIndex > 0) && (insertDirection && insertDirection === 'after')) {
      this.copyResultingToStarting(processIndex, siteIndex, newStageIndex);

      // if Inserting before, and the current Stage is not the first Stage, copy the Resulting Material to Starting Material in new stage.
      if ((stageIndex >= 0) && (insertDirection && insertDirection === 'after')) {
        // Get Current/Source Stage to Copy (Resulting Material -> Starting Material) to New Stage
        this.setSourceStageToCopy(processIndex, siteIndex, newStageIndex + 1);
        this.setSourceStartingToCopy();
        this.copyStartingToResulting(processIndex, siteIndex, newStageIndex);
      }
    }

    /*
    // Copy Resulting Material to Starting Material
    // When adding a new Stage, and if there is Substance Name in the previous Resulting Material, copy/add to
    // Starting Material in the new Stage.
    // Get the last index or push/add/copy to the Starting Material at the Last
    // Get New/Next Stage
    const lastStageIndex = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.length - 2;
    // Get Last Stage to copy Resulting Materials
    alert('lastStageIndex: ' + lastStageIndex);
    if (lastStageIndex >= 0) {
      const lastStageObj = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[lastStageIndex];
      const lastResultIndex = lastStageObj.resultingMaterials.length - 1;

      this.copyResultingToStarting(processIndex, siteIndex, lastStageIndex, lastResultIndex);
    }
    */
  }

  duplicateStage(processIndex: number, siteIndex: number, stageIndex: number, insertDirection?: string): void {
    // Get this/current stage record
    // const thisStageObj = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex];

    // Get Current/Source Stage to Copy (Resulting Material -> Starting Material) to New Stage
    this.setSourceStageToCopy(processIndex, siteIndex, stageIndex);

    // Copy current stage to new stage
    let newStage: SpecifiedSubstanceG4mStage = {};
    // newStage.startingMaterials = this.sourceStageToCopy.startingMaterials;
    // newStage.processingMaterials = this.sourceStageToCopy.resultingMaterials;
    let newStage1 = JSON.stringify(this.sourceStageToCopy);
    newStage = JSON.parse(newStage1);
    let stageIndexNew = 0;
    if (insertDirection && insertDirection === 'before') {
      stageIndexNew = stageIndex + 1;
      // newStage.stageNumber = '343434'; //stageIndexNew.toString();
      this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.splice(stageIndex, 0, newStage);
    } else { // after
      stageIndexNew = stageIndex + 2;
      //  newStage.stageNumber = stageIndexNew.toString();
      this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages.splice(stageIndex + 1, 0, newStage);
    }
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages);
  }

  setSourceStageToCopy(processIndex: number, siteIndex: number, stageIndex: number): void {
    // Get Stage that will be copied to new Stage
    this.sourceStageToCopy = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex];
  }

  setSourceStartingToCopy() {
    this.sourceStartingMatObj = null;
    if (this.sourceStageToCopy !== null && this.sourceStageToCopy !== undefined) {
      const startingLength = this.sourceStageToCopy.startingMaterials.length;
      // If Starting Materials exists in the source Stage, get the Substance Uuid
      if (startingLength > 0) {
        // Get this/current Starting Material Object
        this.sourceStartingMatObj = this.sourceStageToCopy.startingMaterials[startingLength - 1];

        const thisStartingMatSubName = this.sourceStartingMatObj.substanceName;
        // Get this Resulting Material refUuid from Substance Name
        if (thisStartingMatSubName) {
          this.sourceStartingMatRefUuid = thisStartingMatSubName.refuuid;
        } else {
          this.sourceStartingMatRefUuid = null;
        }
      } else {
        this.sourceStartingMatObj = null;
      }
    }
  }

  setSourceResultingToCopy(selectedResultingIndex?: number) {
    this.sourceResultingMatObj = null;
    // If source Stage exists, then get Source Resulting Material
    if (this.sourceStageToCopy !== null && this.sourceStageToCopy !== undefined) {
      const sourceResultingLength = this.sourceStageToCopy.resultingMaterials.length;

      // If Source Resulting Materials exists in the source Stage, then copy
      if (sourceResultingLength > 0) {
        // If selectedResultingIndex exists, Get the selected Resulting Material Object
        // Only copy the selected resulting material item.
        if (selectedResultingIndex >= 0) {
          this.sourceResultingMatObj = this.sourceStageToCopy.resultingMaterials[selectedResultingIndex];

          const thisResultMatSubName = this.sourceResultingMatObj.substanceName;
          // Get this Resulting Material refUuid from Substance Name
          if (thisResultMatSubName) {
            this.sourceResultingMatRefUuid = thisResultMatSubName.refuuid;
          } else {
            this.sourceResultingMatRefUuid = null;
          }
        } else {
          // Get the Source Resulting Material List. Copy all the Resulting Material items in the list
          this.sourceResultingMatList = this.sourceStageToCopy.resultingMaterials;
        }
      } else {
        this.sourceResultingMatObj = null;
      }
    }
  }

  copyStartingToResulting(processIndex: number, siteIndex: number, stageIndex: number) {
    let found = false;
    // let resultMatRefUuid = '';
    let startMatRefUuid = '';

    // Get New Stage Object
    const newStageObj = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex];

    // If New Stage exists
    if (newStageObj !== null && newStageObj !== undefined) {
      // check if Resulting Materials exists in the New Stage
      if (newStageObj.resultingMaterials.length == 0) {
        // if there is no Resulting Material, add a new one and copy
        this.copyToResultingFields(processIndex, siteIndex, stageIndex);
      }
    }
  }

  copyResultingToStarting(processIndex: number, siteIndex: number, stageIndex: number) {
    let found = false;
    // let resultMatRefUuid = '';
    let startMatRefUuid = '';

    // Get New Stage Object
    const newStageObj = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex];

    // If New Stage exists
    if (newStageObj !== null && newStageObj !== undefined) {
      // check if Starting Materials exists in the New Stage
      if (newStageObj.startingMaterials.length == 0) {
        // if there is no Starting Material, add a new one and copy
        this.copyToStartingObject(processIndex, siteIndex, stageIndex);
      } else { // Starting Material exists
        // if Starting Material exists, loop through to find same refuuid
        // if same refuuid found, display message and do not copy
        newStageObj.startingMaterials.forEach(element => {
          if (element) {
            // Get this Starting Material refUuid from Substance Name
            const startMatSubName = element.substanceName;
            if (startMatSubName) {
              startMatRefUuid = startMatSubName.refuuid;
              // If the refuuid for the Resulting Material is same as FIRST Starting Material in the next Stage
              if (this.sourceResultingMatRefUuid === startMatSubName.refuuid) {
                found = true;
                alert('This Substance ' + startMatSubName.name + ' already exists in the Starting Material in the next Stage');
              }
            }
          }
        }); // for each Starting Material in next Stage
        if (found === false) {
          this.copyToStartingObject(processIndex, siteIndex, stageIndex);
        }
      }
    } // New Stage Exists

    // Add a next Stage if it does not exists
    // This part is useful when clicking the copy icon on 'Resulting Material'
    // to copy to 'Starting Material' of next Stage. If there is no Stage exists, create one.
    // This is same as 'Add Step' button.
    if (!newStageObj) {
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

      this.copyToStartingObject(processIndex, siteIndex, stageIndex);
    }

  }

  /*
  copyResultingToStarting(processIndex: number, siteIndex: number, stageIndex: number, resultingMaterialIndex: number) {
    let found = false;
    let resultMatRefUuid = '';
    let startMatRefUuid = '';

    if (this.sourceStageToCopy !== null && this.sourceStageToCopy !== undefined) {
      const resultingLength = this.sourceStageToCopy.resultingMaterials.length;
      if (resultingLength > 0) {
        // Get this/current Resulting Material Object
        const thisResultMatObj = this.sourceStageToCopy.resultingMaterials[resultingLength - 1];
        const thisResultMatSubName = thisResultMatObj.substanceName;
        // Get this Resulting Material refUuid from Substance Name
        if (thisResultMatSubName) {
          resultMatRefUuid = thisResultMatSubName.refuuid;
        }
      }
    }

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
      // This part is useful when clicking the copy icon on 'Resulting Material'
      // to copy to 'Starting Material' of next Stage. If there is no Stage exists, create one.
      // This is same as 'Add Step' button.
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
  */

  copyToStartingObject(processIndex: number, siteIndex: number, stageIndex: number) {
    // Add New Starting Material in the NEXT stage, if the Resulting material exists
    // if (this.sourceResultingMatObj) {

    this.sourceResultingMatList.forEach(sourceResultingMatObj => {
      if (sourceResultingMatObj) {
        // Get this Starting Material refUuid from Substance Name
        if (sourceResultingMatObj.substanceName) {

          // Add new Starting Materials in new Stage
          this.addStartingMaterials(processIndex, siteIndex, stageIndex);

          this.copyToStartingFields(processIndex, siteIndex, stageIndex, sourceResultingMatObj);
        }
      }
    });
}

copyToStartingFields(processIndex: number, siteIndex: number, stageIndex: number, sourceResultingMatObj: SpecifiedSubstanceG4mResultingMaterial) {
  // Get New Stage
  const newStageObj = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex];

  // copy to the Starting Material in the new Stage
  const newStartIndex = newStageObj.startingMaterials.length - 1;
  const newStartMat = newStageObj.startingMaterials[newStartIndex];

  // Copy to new Starting Material
  newStartMat.substanceName = sourceResultingMatObj.substanceName;
  newStartMat.verbatimName = sourceResultingMatObj.verbatimName;
  newStartMat.substanceRole = 'Intermediate';
  newStartMat.comments = sourceResultingMatObj.comments;
}

copyToResultingFields(processIndex: number, siteIndex: number, stageIndex: number) {
  if (this.sourceStartingMatObj) {
    this.addResultingMaterials(processIndex, siteIndex, stageIndex);
    // New Stage and New Resulting Material
    // Get New Stage
    const newStageObj = this.substance.specifiedSubstanceG4m.process[processIndex].sites[siteIndex].stages[stageIndex];

    // Copy to the Resulting Material in the new Stage
    const newResultIndex = newStageObj.resultingMaterials.length - 1;
    const newResulttMat = newStageObj.resultingMaterials[newResultIndex];
    newResulttMat.substanceName = this.sourceStartingMatObj.substanceName;
    newResulttMat.verbatimName = this.sourceStartingMatObj.verbatimName;
    newResulttMat.substanceRole = 'Intermediate';
    newResulttMat.comments = this.sourceStartingMatObj.comments;
  }
}

  /*
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
    nextStartMat.substanceRole = 'Intermediate';  //  thisResultMatObj.substanceRole;
    nextStartMat.comments = thisResultMatObj.comments;
  }
  */
}
