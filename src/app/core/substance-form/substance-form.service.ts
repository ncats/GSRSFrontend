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

      this.substanceEmitter.next(this.substance);
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

  updateMoieties(moieties: Array<SubstanceMoiety>): any {
    this.substance.moieties = [];
    moieties.forEach(moiety => {
      const moi: SubstanceMoiety = {};
      Object.keys(moiety).forEach(key => {
        moi[key] = moiety[key];
      });
      this.substance.moieties.push(moi);
    });
  }

  // Structure end

  saveSubstance(): Observable<SubstanceFormResults> {
    return new Observable(observer => {
      const results: SubstanceFormResults = {
        isSuccessfull: true
      };
      if (this.substance.structure != null) {
        this.substance.structure.id = this.utilsService.newUUID();
        this.substance.structure.uuid = this.substance.structure.id;
      }
      if (this.substance.moieties != null && this.substance.moieties.length) {
        this.substance.moieties.forEach(moiety => {
          moiety.id = this.utilsService.newUUID();
        });
      }
      this.substanceService.saveSubstance(this.substance).subscribe(substance => {
        this.domainReferences = {};
        this.substance = substance;
        this.definitionEmitter.next(this.getDefinition());
        this.substanceReferencesEmitter.next(this.substance.references);
        this.substanceNamesEmitter.next(this.substance.names);
        this.substanceStructureEmitter.next(this.substance.structure);
        observer.next(results);
      }, error => {
        results.isSuccessfull = false;
        observer.error(results);
      });
    });
  }
}
