import { Injectable } from '@angular/core';
import {
  SubstanceDetail,
  SubstanceReference,
  SubstanceName,
  SubstanceStructure,
  SubstanceMoiety
} from '../substance/substance.model';
import {
  SubstanceFormDefinition,
  SubstanceFormResults
} from './substance-form.model';
import { Observable, Subject } from 'rxjs';
import { SubstanceService } from '../substance/substance.service';
import { referencesDomains } from './domain-references/domains.constant';
import { DomainReferences } from './domain-references/domain-references';
import { UtilsService } from '../utils/utils.service';
import { StructureService } from '@gsrs-core/structure';

@Injectable({
  providedIn: 'root'
})
export class SubstanceFormService {
  private substance: SubstanceDetail;
  private substanceEmitter = new Subject<SubstanceDetail>();
  private definitionEmitter = new Subject<SubstanceFormDefinition>();
  private substanceReferencesEmitter = new Subject<Array<SubstanceReference>>();
  private domainReferences: { [uuid: string]: DomainReferences } = {};
  private substanceNamesEmitter = new Subject<Array<SubstanceName>>();
  private substanceStructureEmitter = new Subject<SubstanceStructure>();
  private subClass: string;
  private computedMoieties: Array<SubstanceMoiety>;
  private deletedMoieties: Array<SubstanceMoiety> = [];
  private substanceMoietiesEmitter = new Subject<Array<SubstanceMoiety>>();

  constructor(
    private substanceService: SubstanceService,
    public utilsService: UtilsService,
    private structureService: StructureService
  ) { }

  loadSubstance(substanceClass: string = 'chemical', substance?: SubstanceDetail): void {
    setTimeout(() => {

      if (substance != null) {
        this.substance = substance;
      } else {
        this.substance = {
          substanceClass: substanceClass,
          references: [],
          names: [],
          structure: {}
        };
      }

      this.subClass = this.substance.substanceClass;

      if (this.subClass === 'chemical') {
        this.subClass = 'structure';
      } else if (this.subClass === 'specifiedSubstanceG1') {
        this.subClass = 'specifiedSubstance';
      }

      if (this.substance[this.subClass] == null) {
        this.substance[this.subClass] = {};
      }

      if (this.substance.structure != null && this.substance.structure.molfile != null) {
        this.structureService.postStructure(this.substance.structure.molfile).subscribe(response => {
          this.computedMoieties = response.moieties;
          this.substanceEmitter.next(this.substance);
        });
      } else {
        this.substanceEmitter.next(this.substance);
      }
    });
  }

  ready(): Observable<void> {
    return new Observable(observer => {
      if (this.substance != null) {
        observer.next();
        observer.complete();
      } else {
        const subscription = this.substanceEmitter.subscribe(substance => {
          observer.next();
          observer.complete();
          subscription.unsubscribe();
        });
      }
    });
  }

  getSubstanceValue(key: string): any {
    return this.substance[key];
  }

  // Definition Start

  get definition(): Observable<SubstanceFormDefinition> {
    setTimeout(() => {
      if (this.substance != null) {
        this.definitionEmitter.next(this.getDefinition());
      } else {
        const subscription = this.substanceEmitter.subscribe(substance => {
          this.definitionEmitter.next(this.getDefinition());
          subscription.unsubscribe();
        });
      }
    });
    return this.definitionEmitter.asObservable();
  }

  updateDefinition(definition: SubstanceFormDefinition): void {
    this.substance.definitionType = definition.definitionType;
    this.substance.definitionLevel = definition.definitionLevel;
    this.substance.deprecated = definition.deprecated;
    this.substance.access = definition.access;
    if (this.substance[definition.substanceClass]) {
      this.substance[definition.substanceClass].references = definition.references;
    } else {
      this.substance[definition.substanceClass] = {
        references: definition.references
      };
    }
  }

  private getDefinition(): SubstanceFormDefinition {

    const definition: SubstanceFormDefinition = {
      uuid: this.substance[this.subClass].uuid || this.substance[this.subClass].id,
      substanceClass: this.subClass,
      definitionType: this.substance.definitionType,
      definitionLevel: this.substance.definitionLevel,
      deprecated: this.substance.deprecated,
      references: this.substance[this.subClass] && this.substance[this.subClass].references || [],
      access: this.substance.access,
      relationships: this.substance.relationships
    };

    return definition;
  }

  // Definition end

  // References start

  get substanceReferences(): Observable<Array<SubstanceReference>> {
    setTimeout(() => {
      if (this.substance != null) {
        if (this.substance.references == null) {
          this.substance.references = [];
        }
        this.substanceReferencesEmitter.next(this.substance.references);
      } else {
        const subscription = this.substanceEmitter.subscribe(substance => {
          if (this.substance.references == null) {
            this.substance.references = [];
          }
          this.substanceReferencesEmitter.next(this.substance.references);
          subscription.unsubscribe();
        });
      }
    });
    return this.substanceReferencesEmitter.asObservable();
  }

  addSubstanceReference(reference: SubstanceReference): SubstanceReference {
    reference.uuid = this.utilsService.newUUID();
    if (this.substance.references == null) {
      this.substance.references = [];
    }
    this.substance.references.unshift(reference);
    return reference;
  }

  getDomainReferences(uuid: string): DomainReferences {
    if (this.domainReferences[uuid] != null) {
      return this.domainReferences[uuid];
    } else {
      let domain: string;

      if (this.substance[this.subClass] && (this.substance[this.subClass].uuid === uuid || this.substance[this.subClass].id === uuid)) {
        domain = this.substance[this.subClass];
      } else {
        for (let i = 0; i < referencesDomains.length; i++) {
          if (this.substance[referencesDomains[i]]) {
            if (Object.prototype.toString.call(this.substance[referencesDomains[i]]) === '[object Array]'
              && this.substance[referencesDomains[i]].length) {

              domain = this.substance[referencesDomains[i]].find(_domain => _domain.uuid === uuid);

              if (domain != null) {
                break;
              }

            } else if (Object.prototype.toString.call(this.substance[referencesDomains[i]]) === '[object Object]'
              && this.substance[referencesDomains[i]].uuid === uuid) {
              domain = this.substance[referencesDomains[i]];
              break;
            }
          }
        }
      }

      this.domainReferences[uuid] = new DomainReferences(domain, this.substance.references, this.utilsService);
      return this.domainReferences[uuid];
    }
  }

  deleteSubstanceReference(reference: SubstanceReference): void {
    Object.keys(this.domainReferences).forEach(key => {
      this.domainReferences[key].removeDomainReference(reference.uuid);
    });
    const subRefIndex = this.substance.references.findIndex(subReference => reference.uuid === subReference.uuid);
    if (subRefIndex > -1) {
      this.substance.references.splice(subRefIndex, 1);
    }
  }

  // References end

  // Names start

  get substanceNames(): Observable<Array<SubstanceName>> {
    setTimeout(() => {
      if (this.substance != null) {
        if (this.substance.names == null) {
          this.substance.names = [];
        }
        this.substanceNamesEmitter.next(this.substance.names);
      } else {
        const subscription = this.substanceEmitter.subscribe(substance => {
          if (this.substance.names == null) {
            this.substance.names = [];
          }
          this.substanceNamesEmitter.next(this.substance.names);
          subscription.unsubscribe();
        });
      }
    });
    return this.substanceNamesEmitter.asObservable();
  }

  deleteSubstanceName(name: SubstanceName): void {
    const subNameIndex = this.substance.names.findIndex(subName => name.uuid === subName.uuid);
    if (subNameIndex > -1) {
      this.substance.names.splice(subNameIndex, 1);
      this.substanceNamesEmitter.next(this.substance.names);
    }
  }

  // Names end

  // Structure start

  get substanceStructure(): Observable<SubstanceStructure> {
    setTimeout(() => {
      if (this.substance != null) {
        if (this.substance.structure == null) {
          this.substance.structure = {};
        }
        this.substanceStructureEmitter.next(this.substance.structure);
      } else {
        const subscription = this.substanceEmitter.subscribe(substance => {
          if (this.substance.structure == null) {
            this.substance.structure = {};
          }
          this.substanceStructureEmitter.next(this.substance.structure);
          subscription.unsubscribe();
        });
      }
    });
    return this.substanceStructureEmitter.asObservable();
  }

  get substanceMoieties(): Observable<Array<SubstanceMoiety>> {
    setTimeout(() => {
      if (this.substance != null) {
        if (this.substance.moieties == null) {
          this.substance.moieties = [];
        }
        this.substanceMoietiesEmitter.next(this.substance.moieties);
      } else {
        const subscription = this.substanceEmitter.subscribe(substance => {
          if (this.substance.moieties == null) {
            this.substance.moieties = [];
          }
          this.substanceMoietiesEmitter.next(this.substance.moieties);
          subscription.unsubscribe();
        });
      }
    });
    return this.substanceMoietiesEmitter.asObservable();
  }

  updateMoieties(moieties: Array<SubstanceMoiety>): any {

    const moietiesCopy = moieties.slice();
    const substanceMoietiesCopy = this.substance.moieties.slice();

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
          // moietyCopy.id = this.utilsService.newUUID();
          // moietyCopy.uuid = moietyCopy.id;
          moietyCopy.uuid = '';
          this.substance.moieties.push(moietyCopy);
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
    console.log(this.substance.moieties);
  }

  // Structure end

  saveSubstance(): Observable<SubstanceFormResults> {
    return new Observable(observer => {
      const results: SubstanceFormResults = {
        isSuccessfull: true
      };
      if (this.substance.structure != null && !this.substance.structure.uuid) {
        this.substance.structure.id = this.utilsService.newUUID();
        this.substance.structure.uuid = this.substance.structure.id;
      }
      if (this.substance.moieties != null && this.substance.moieties.length) {
        this.substance.moieties.forEach(moiety => {
          if (!moiety.uuid) {
            moiety.id = this.utilsService.newUUID();
            moiety.uuid = moiety.id;
          }
        });
      }
      this.substanceService.saveSubstance(this.substance).subscribe(substance => {
        this.domainReferences = {};
        this.substance = substance;
        this.definitionEmitter.next(this.getDefinition());
        this.substanceReferencesEmitter.next(this.substance.references);
        this.substanceNamesEmitter.next(this.substance.names);
        this.substanceStructureEmitter.next(this.substance.structure);
        this.substanceMoietiesEmitter.next(this.substance.moieties);
        observer.next(results);
      }, error => {
        results.isSuccessfull = false;
        observer.error(results);
      });
    });
  }
}
