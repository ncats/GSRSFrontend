import { Injectable } from '@angular/core';
import {
  SubstanceDetail,
  SubstanceReference,
  SubstanceName,
  SubstanceStructure,
  SubstanceMoiety,
  SubstanceCode,
  SubstanceRelationship,
  SubstanceNote,
  SubstanceProperty
} from '../substance/substance.model';
import {
  SubstanceFormDefinition,
  SubstanceFormResults, ValidationResults
} from './substance-form.model';
import { Observable, Subject } from 'rxjs';
import { SubstanceService } from '../substance/substance.service';
import { domainKeys, domainDisplayKeys } from './domain-references/domain-keys.constant';
import { UtilsService } from '../utils/utils.service';
import { StructureService } from '@gsrs-core/structure';
import { DomainsWithReferences } from './domain-references/domain.references.model';

@Injectable({
  providedIn: 'root'
})
export class SubstanceFormService {
  private substance: SubstanceDetail;
  private substanceEmitter = new Subject<SubstanceDetail>();
  private definitionEmitter = new Subject<SubstanceFormDefinition>();
  private substanceReferencesEmitter = new Subject<Array<SubstanceReference>>();
  private substanceNamesEmitter = new Subject<Array<SubstanceName>>();
  private substanceStructureEmitter = new Subject<SubstanceStructure>();
  private subClass: string;
  private computedMoieties: Array<SubstanceMoiety>;
  private deletedMoieties: Array<SubstanceMoiety> = [];
  private substanceMoietiesEmitter = new Subject<Array<SubstanceMoiety>>();
  private substanceCodesEmitter = new Subject<Array<SubstanceCode>>();
  private substanceRelationshipsEmitter = new Subject<Array<SubstanceRelationship>>();
  private privateDomainsWithReferences: DomainsWithReferences;
  private domainsWithReferencesEmitter = new Subject<DomainsWithReferences>();
  private substanceNotesEmitter = new Subject<Array<SubstanceNote>>();
  private substancePropertiesEmitter = new Subject<Array<SubstanceProperty>>();

  constructor(
    private substanceService: SubstanceService,
    public utilsService: UtilsService,
    private structureService: StructureService
  ) { }

  loadSubstance(substanceClass: string = 'chemical', substance?: SubstanceDetail): void {
    setTimeout(() => {

      this.computedMoieties = null;
      this.deletedMoieties = [];
      this.privateDomainsWithReferences = null;

      if (substance != null) {
        this.substance = substance;
      } else {
        this.substance = {
          substanceClass: substanceClass,
          references: [],
          names: [],
          structure: {},
          codes: [],
          relationships: [],
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

  unloadSubstance(): void {
    this.substance = null;
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
    return new Observable(observer => {
      this.ready().subscribe(() => {
        observer.next(this.getDefinition());
        this.definitionEmitter.subscribe(definition => {
          observer.next(this.getDefinition());
        });
      });
    });
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
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.references == null) {
          this.substance.references = [];
        }
        observer.next(this.substance.references);
        this.substanceReferencesEmitter.subscribe(references => {
          observer.next(this.substance.references);
        });
      });
    });
  }

  addSubstanceReference(reference: SubstanceReference): SubstanceReference {
    reference.uuid = this.utilsService.newUUID();
    if (this.substance.references == null) {
      this.substance.references = [];
    }
    this.substance.references.unshift(reference);
    return reference;
  }

  get domainsWithReferences(): Observable<DomainsWithReferences> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        observer.next(this.getDomainReferences());
        this.domainsWithReferencesEmitter.subscribe(domains => {
          observer.next(this.getDomainReferences());
        });
      });
    });
  }

  getDomainReferences(): DomainsWithReferences {
    if (this.privateDomainsWithReferences == null) {
      this.privateDomainsWithReferences = {
        definition: {
          subClass: this.subClass,
          domain: this.substance[this.subClass]
        }
      };

      domainKeys.forEach(key => {
        this.privateDomainsWithReferences[key] = {
          listDisplay: key,
          displayKey: domainDisplayKeys[key],
          domains: this.substance[key]
        };
      });

    }

    return this.privateDomainsWithReferences;
  }

  deleteSubstanceReference(reference: SubstanceReference): void {
    const subRefIndex = this.substance.references.findIndex(subReference => reference.uuid === subReference.uuid);
    if (subRefIndex > -1) {
      this.substance.references.splice(subRefIndex, 1);
    }
  }

  // References end

  // Names start

  get substanceNames(): Observable<Array<SubstanceName>> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.names == null) {
          this.substance.names = [];
        }
        observer.next(this.substance.names);
        this.substanceNamesEmitter.subscribe(names => {
          observer.next(this.substance.names);
        });
      });
    });
  }

  addSubstanceName(): void {
    const newName: SubstanceName = {
      references: [],
      access: []
    };
    this.substance.names.unshift(newName);
    this.substanceNamesEmitter.next(this.substance.names);
  }

  deleteSubstanceName(name: SubstanceName): void {
    const subNameIndex = this.substance.names.findIndex(subName => name.$$deletedCode === subName.$$deletedCode);
    if (subNameIndex > -1) {
      this.substance.names.splice(subNameIndex, 1);
      this.substanceNamesEmitter.next(this.substance.names);
    }
  }

  // Names end

  // Structure start

  get substanceStructure(): Observable<SubstanceStructure> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.structure == null) {
          this.substance.structure = {
            references: [],
            access: []
          };
        }
        observer.next(this.substance.structure);
        this.substanceStructureEmitter.subscribe(structure => {
          observer.next(this.substance.structure);
        });
      });
    });
  }

  get substanceMoieties(): Observable<Array<SubstanceMoiety>> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.moieties == null) {
          this.substance.moieties = [];
        }
        observer.next(this.substance.moieties);
        this.substanceMoietiesEmitter.subscribe(moieties => {
          observer.next(this.substance.moieties);
        });
      });
    });
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
  }

  // Structure end

  // Codes start

  get substanceCodes(): Observable<Array<SubstanceCode>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.codes == null) {
          this.substance.codes = [];
        }
        observer.next(this.substance.codes);
        this.substanceCodesEmitter.subscribe(codes => {
          observer.next(this.substance.codes);
        });
      });
    });
  }

  addSubstanceCode(): void {
    const newCode: SubstanceCode = {
      references: [],
      access: []
    };
    this.substance.codes.unshift(newCode);
    this.substanceCodesEmitter.next(this.substance.codes);
  }

  deleteSubstanceCode(code: SubstanceCode): void {
    const subCodeIndex = this.substance.codes.findIndex(subCode => code.$$deletedCode === subCode.$$deletedCode);
    if (subCodeIndex > -1) {
      this.substance.codes.splice(subCodeIndex, 1);
      this.substanceCodesEmitter.next(this.substance.codes);
    }
  }

  // Codes end

  // Relationships start

  get substanceRelationships(): Observable<Array<SubstanceRelationship>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.relationships == null) {
          this.substance.relationships = [];
        }
        observer.next(this.substance.relationships);
        this.substanceRelationshipsEmitter.subscribe(relationships => {
          observer.next(this.substance.relationships);
        });
      });
    });
  }

  addSubstanceRelationship(): void {
    const newRelationship: SubstanceRelationship = {
      relatedSubstance: {},
      amount: {},
      references: [],
      access: []
    };
    this.substance.relationships.unshift(newRelationship);
    this.substanceRelationshipsEmitter.next(this.substance.relationships);
  }

  deleteSubstanceRelationship(relationship: SubstanceRelationship): void {
    const subRelationshipIndex = this.substance.relationships
      .findIndex(subRelationship => relationship.$$deletedCode === subRelationship.$$deletedCode);
    if (subRelationshipIndex > -1) {
      this.substance.relationships.splice(subRelationshipIndex, 1);
      this.substanceRelationshipsEmitter.next(this.substance.relationships);
    }
  }

  // Relationships end

  // Notes start

  get substanceNotes(): Observable<Array<SubstanceNote>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.notes == null) {
          this.substance.notes = [];
        }
        observer.next(this.substance.notes);
        this.substanceNotesEmitter.subscribe(notes => {
          observer.next(this.substance.notes);
        });
      });
    });
  }

  addSubstanceNote(): void {
    const newNote: SubstanceNote = {
      references: [],
      access: []
    };
    this.substance.notes.unshift(newNote);
    this.substanceNotesEmitter.next(this.substance.notes);
  }

  deleteSubstanceNote(note: SubstanceNote): void {
    const subNoteIndex = this.substance.notes.findIndex(subNote => note.$$deletedCode === subNote.$$deletedCode);
    if (subNoteIndex > -1) {
      this.substance.notes.splice(subNoteIndex, 1);
      this.substanceNotesEmitter.next(this.substance.notes);
    }
  }

  // Notes end

  // Properties start

  get substanceProperties(): Observable<Array<SubstanceProperty>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.properties == null) {
          this.substance.properties = [];
        }
        observer.next(this.substance.properties);
        this.substancePropertiesEmitter.subscribe(properties => {
          observer.next(this.substance.properties);
        });
      });
    });
  }

  addSubstanceProperty(): void {
    const newProperty: SubstanceProperty = {
      value: {},
      references: [],
      access: []
    };
    this.substance.properties.unshift(newProperty);
    this.substancePropertiesEmitter.next(this.substance.properties);
  }

  deleteSubstanceProperty(property: SubstanceProperty): void {
    const subPropertyIndex = this.substance.properties.findIndex(subProperty => property.$$deletedCode === subProperty.$$deletedCode);
    if (subPropertyIndex > -1) {
      this.substance.properties.splice(subPropertyIndex, 1);
      this.substancePropertiesEmitter.next(this.substance.properties);
    }
  }

  // Properties end

  validateSubstance(): Observable<ValidationResults> {
    return new Observable(observer => {
        this.substanceService.validateSubstance(this.substance).subscribe(results => {
          observer.next(results);
          observer.complete();
        });
      });
  }

  removeDeletedComponents(): SubstanceDetail {
    const substanceString = JSON.stringify(this.substance);
    const substanceCopy: SubstanceDetail = JSON.parse(substanceString);
    const deletablekeys = [
      'names',
      'codes',
      'relationships',
      'notes',
      'properties',
      'references'
    ];

    deletablekeys.forEach(property => {
      if (substanceCopy[property] && substanceCopy[property].length) {
        substanceCopy[property].map((item: any) => {
          const hasDeleletedCode = item.$$deletedCode != null;
          if (!hasDeleletedCode) {
            delete item.$$deletedCode;
            return item;
          }
        });
      }
    });

    return substanceCopy;
  }

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

      const substanceCopy = this.removeDeletedComponents();

      this.substanceService.saveSubstance(substanceCopy).subscribe(substance => {
        this.substance = substance;
        results.uuid = substance.uuid;
        this.definitionEmitter.next(this.getDefinition());
        this.substanceReferencesEmitter.next(this.substance.references);
        this.domainsWithReferencesEmitter.next(this.getDomainReferences());
        this.substanceNamesEmitter.next(this.substance.names);
        this.substanceStructureEmitter.next(this.substance.structure);
        this.substanceMoietiesEmitter.next(this.substance.moieties);
        this.substanceCodesEmitter.next(this.substance.codes);
        this.substanceRelationshipsEmitter.next(this.substance.relationships);
        this.substanceNamesEmitter.next(this.substance.notes);
        observer.next(results);
        observer.complete();
      }, error => {
        results.isSuccessfull = false;
        if (error && error.error && error.error.validationMessages) {
          results.validationMessages = error.error.validationMessages;
        }
        observer.error(results);
        observer.complete();
      });
    });
  }
}
