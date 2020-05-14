import { Injectable, OnDestroy } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { ReplaySubject, Observable } from 'rxjs';
import { SubstanceStructure, SubstanceMoiety, PolymerClassification } from '@gsrs-core/substance/substance.model';
import { StructureService } from '@gsrs-core/structure';
import { take } from 'rxjs/operators';

@Injectable()
export class SubstanceFormStructureService extends SubstanceFormServiceBase<SubstanceStructure> {
  private substanceIdealizedStructureEmitter = new ReplaySubject<SubstanceStructure>();
  private substanceMoietiesEmitter = new ReplaySubject<Array<SubstanceMoiety>>();
  private computedMoieties: Array<SubstanceMoiety>;
  private deletedMoieties: Array<SubstanceMoiety> = [];

  constructor(
    public substanceFormService: SubstanceFormService,
    public structureService: StructureService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const substanceSubscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.polymer != null || this.substance.structure != null) {
        if (this.substance.polymer != null) {
          if (this.substance.polymer.idealizedStructure == null) {
            this.substance.polymer.idealizedStructure = {
              references: [],
              access: []
            };
          }
          this.substanceIdealizedStructureEmitter.next(this.substance.polymer.idealizedStructure);
        } else if (this.substance.structure != null) {
          if (this.substance.structure == null) {
            this.substance.structure = {
              references: [],
              access: []
            };
          }
          this.propertyEmitter.next(this.substance.structure);
        }
        this.setMoities();
        this.substanceFormService.resetState();
        this.substanceMoietiesEmitter.next(this.substance.moieties);
      }
    });
    this.subscriptions.push(substanceSubscription);
  }

  setMoities(): void {
    if (this.substance.structure != null && this.substance.structure.molfile != null) {
      this.structureService.interpretStructure(this.substance.structure.molfile).pipe(take(1)).subscribe(response => {
        this.computedMoieties = response.moieties;
      });
    }
    if (this.substance.substanceClass === 'polymer') {
      this.substance.moieties = [];
      if (this.substance.polymer.idealizedStructure != null && this.substance.polymer.idealizedStructure.molfile != null) {
        this.structureService.interpretStructure(this.substance.polymer.idealizedStructure.molfile).pipe(take(1)).subscribe(response => {
          this.computedMoieties = response.moieties;
          this.substance.moieties = response.moieties;
        });
      }
    }
    if (this.substance.moieties == null) {
      this.substance.moieties = [];
    }
  }

  unloadSubstance() {
    this.substanceIdealizedStructureEmitter.complete();
    this.substanceIdealizedStructureEmitter = new ReplaySubject<SubstanceStructure>();
    this.substanceMoietiesEmitter.complete();
    this.substanceMoietiesEmitter = new ReplaySubject<Array<SubstanceMoiety>>();
    super.unloadSubstance();
  }

  get substanceIdealizedStructure(): Observable<SubstanceStructure> {
    return this.substanceIdealizedStructureEmitter.asObservable();
  }

  get substanceStructure(): Observable<SubstanceStructure> {
    return this.propertyEmitter.asObservable();
  }

  get substanceMoieties(): Observable<Array<SubstanceMoiety>> {
    return this.substanceMoietiesEmitter.asObservable();
  }

  updateMoieties(moieties: Array<SubstanceMoiety>): void {

    const moietiesCopy = moieties.slice();
    const substanceMoietiesCopy = this.substance.moieties ? this.substance.moieties.slice() : [];

    if (this.substance.moieties) {
      this.substance.moieties.forEach((subMoiety, index) => {
        const matchingMoietyIndex = moietiesCopy.findIndex(moiety => moiety.hash === subMoiety.hash);

        if (matchingMoietyIndex > -1) {
          subMoiety.molfile = moietiesCopy[matchingMoietyIndex].molfile;

          const matchingComputedMoiety = this.computedMoieties.find(computedMoiety => computedMoiety.hash === subMoiety.hash);

          if (matchingComputedMoiety != null && moietiesCopy[matchingMoietyIndex].count !== matchingComputedMoiety.count) {
            subMoiety.count = moietiesCopy[matchingMoietyIndex].count;
            subMoiety.countAmount = moietiesCopy[matchingMoietyIndex].countAmount;
          }

          const substanceIndexToRemove = substanceMoietiesCopy.findIndex(moietyCopy => moietyCopy.hash === subMoiety.hash);
          const moietyIndexToRemove = moietiesCopy.findIndex(moietyCopy => moietyCopy.hash === subMoiety.hash);
          substanceMoietiesCopy.splice(substanceIndexToRemove, 1);
          moietiesCopy.splice(moietyIndexToRemove, 1);
        }
      });
    }

    if (moietiesCopy.length > 0) {
      moietiesCopy.forEach(moietyCopy => {
        const moietyIndexInDeleted = this.deletedMoieties.findIndex(deletedMoiety => deletedMoiety.hash === moietyCopy.hash);

        if (moietyIndexInDeleted > -1) {
          const undeletedMoiety = this.deletedMoieties.splice(moietyIndexInDeleted, 1)[0];

          undeletedMoiety.molfile = moietyCopy.molfile;

          const matchingComputedMoiety = this.computedMoieties.find(computedMoiety => computedMoiety.hash === undeletedMoiety.hash);

          if (matchingComputedMoiety != null && moietyCopy.count !== matchingComputedMoiety.count) {
            undeletedMoiety.count = moietyCopy.count;
            undeletedMoiety.countAmount = moietyCopy.countAmount;
          }

          this.substance.moieties.push(undeletedMoiety);
        } else {
          moietyCopy.uuid = '';
          if (this.substance.moieties) {
            this.substance.moieties.push(moietyCopy);
          }
        }
      });
    }

    if (substanceMoietiesCopy.length > 0) {
      substanceMoietiesCopy.forEach(subMoietyCopy => {
        const indexToDelete = this.substance.moieties.findIndex(subMoiety => subMoiety.hash === subMoietyCopy.hash);
        if (indexToDelete > -1) {
          const deletedMoiety = this.substance.moieties.splice(indexToDelete, 1)[0];
          this.deletedMoieties.push(deletedMoiety);
        }
      });
    }

    this.computedMoieties = moieties;
    this.substanceMoietiesEmitter.next(this.substance.moieties);
  }

  get substanceDisplayStructure(): Observable<PolymerClassification> {
    return this.substanceIdealizedStructureEmitter.asObservable();
  }
}
