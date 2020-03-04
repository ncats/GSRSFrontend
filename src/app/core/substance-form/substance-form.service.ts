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
  SubstanceProperty,
  Subunit,
  Link,
  DisulfideLink,
  Glycosylation,
  Site,
  AgentModification,
  PhysicalModification,
  StructuralModification,
  Protein,
  Feature,
  Sugar,
  Linkage,
  NucleicAcid,
  MixtureComponents,
  Mixture,
  StructurallyDiverse, Constituent, DisplayStructure, Monomer, PolymerClassification
} from '../substance/substance.model';
import {
  SequenceUnit,
  SubstanceFormDefinition,
  SubstanceFormResults, SubunitSequence, ValidationResults
} from './substance-form.model';
import { Observable, Subject, observable } from 'rxjs';
import { SubstanceService } from '../substance/substance.service';
import { domainKeys, domainDisplayKeys } from './domain-references/domain-keys.constant';
import { UtilsService } from '../utils/utils.service';
import { StructureService } from '@gsrs-core/structure';
import { DomainsWithReferences } from './domain-references/domain.references.model';
import {StructuralUnit} from '@gsrs-core/substance';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class SubstanceFormService {
  private substance: SubstanceDetail;
  private substanceStateHash?: number;
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
  private substanceSubunitsEmitter = new Subject<Array<Subunit>>();
  private substanceOtherLinksEmitter = new Subject<Array<Link>>();
  private substanceDisulfideLinksEmitter = new Subject<Array<DisulfideLink>>();
  private substanceGlycosylationEmitter = new Subject<Glycosylation>();
  private substanceCysteineEmitter = new Subject<Array<Site>>();
  private substanceLinksEmitter = new Subject<Array<Linkage>>();
  private substanceSugarsEmitter = new Subject<Array<Sugar>>();
  private substanceAgentModificationsEmitter = new Subject<Array<AgentModification>>();
  private substancePhysicalModificationsEmitter = new Subject<Array<PhysicalModification>>();
  private substanceStructuralModificationsEmitter = new Subject<Array<StructuralModification>>();
  private substanceProteinEmitter = new Subject<Protein>();
  private substanceNucleicAcidEmitter = new Subject<NucleicAcid>();
  private substanceMixtureEmitter = new Subject<Mixture>();
  private substanceStructurallyDiverseEmitter = new Subject<StructurallyDiverse>();
  private substanceMixtureComponentsEmitter = new Subject<Array<MixtureComponents>>();
  private substanceConstituentsEmitter = new Subject<Array<MixtureComponents>>();
  private substanceIdealizedStructureEmitter = new Subject<DisplayStructure>();
  private substanceMonomerEmitter = new Subject<Array<Monomer>>();
  private substancePolymerClassificationEmitter = new Subject<PolymerClassification>();
  private substanceSRUEmitter = new Subject<Array<StructuralUnit>>();
  private customFeaturesEmitter = new Subject<Array<Feature>>();
  private customFeatures: Array<Feature>;
  private cysteine: Array<Site>;
  private allSitesArr: Array<DisplaySite>;
  private allSitesEmitter = new Subject<Array<DisplaySite>>();
  private displaySequences: Array<SubunitSequence>;
  private displaySequencesEmitter = new Subject<Array<SubunitSequence>>();
  private substanceChangeReasonEmitter = new Subject<string>();
  private nameResolver = new Subject<string>();
  resolvedMol = this.nameResolver.asObservable();


  constructor(
    private substanceService: SubstanceService,
    public utilsService: UtilsService,
    private structureService: StructureService,
  ) {
  }

  loadSubstance(substanceClass: string = 'chemical', substance?: SubstanceDetail): void {
    setTimeout(() => {
      this.computedMoieties = null;
      this.deletedMoieties = [];
      this.privateDomainsWithReferences = null;
      if (substance != null) {
        this.substance = substance;
        substanceClass = this.substance.substanceClass;
      } else {
        if (substanceClass === 'chemical') {
          this.substance = {
            substanceClass: substanceClass,
            references: [],
            names: [],
            structure: {},
            codes: [],
            relationships: [],
          };
        } else if (substanceClass === 'protein') {
          this.substance = {
            substanceClass: substanceClass,
            references: [],
            names: [],
            protein: {proteinType: ''},
            codes: [],
            relationships: [],
          };
        } else if (substanceClass === 'nucleicAcid') {
          this.substance = {
            substanceClass: substanceClass,
            references: [],
            names: [],
            nucleicAcid: {},
            codes: [],
            relationships: [],
          };
        } else if (substanceClass === 'mixture') {
          this.substance = {
            substanceClass: substanceClass,
            references: [],
            names: [],
            nucleicAcid: {},
            codes: [],
            relationships: []
          };
        } else if (substanceClass === 'structurallyDiverse') {
          this.substance = {
            substanceClass: substanceClass,
            references: [],
            names: [],
            structurallyDiverse: {
              part: ['whole'],
              $$diverseType: 'whole'
            },
            codes: [],
            relationships: []
          };
        } else if (substanceClass === 'specifiedSubstanceG1') {
          this.substance = {
            substanceClass: substanceClass,
            references: [],
            names: [],
            structurallyDiverse: {
              part: ['whole'],
              $$diverseType: 'whole'
            },
            codes: [],
            relationships: []
          };
        } else if (substanceClass === 'polymer') {
        this.substance = {
          substanceClass: substanceClass,
          references: [],
          names: [],
          polymer: {
            idealizedStructure: {},
            monomers: [],
          },
          codes: [],
          moieties: [],
          relationships: []
        };
      } else {
          this.substance = {
            substanceClass: substanceClass,
            references: [],
            names: [],
            codes: [],
            relationships: []
          };
        }
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

      if (this.substance.substanceClass === 'polymer') {
        this.substance.moieties = [];
        if (this.substance.polymer.idealizedStructure != null && this.substance.polymer.idealizedStructure.molfile != null) {
        this.structureService.postStructure(this.substance.polymer.idealizedStructure.molfile).subscribe(response => {
          this.computedMoieties = response.moieties;
          this.substance.moieties = response.moieties;
          this.substanceEmitter.next(this.substance);
        });
        }
      }
      const substanceString = JSON.stringify(this.substance);
      this.substanceStateHash = this.utilsService.hashCode(substanceString);
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

  switchType(substance: SubstanceDetail, newClass: string) {
    const fieldGetter = {
      'protein': ['protein', 'modifications', 'properties'],
      'chemical': ['structure', 'moieties', 'modifications', 'properties'],
      'structurallyDiverse': ['structurallyDiverse', 'modifications', 'properties'],
      'polymer': ['polymer', 'modifications', 'properties'],
      'nucleicAcid': ['nucleicAcid', 'modifications', 'properties'],
      'mixture' : ['mixture', 'modifications', 'properties'],
      'specifiedSubstanceG1' : []
    };
    if (fieldGetter[newClass]) {
      fieldGetter[newClass].forEach(function (x) {
        if (substance[x]) {
          delete substance[x];
        }
      });
    }
    substance.substanceClass = newClass;
    if (newClass === 'chemical') {
      substance.structure = {};
    } else if (newClass === 'protein') {
      substance.protein = {proteinType: ''};

    } else if (newClass === 'nucleicAcid') {
      substance.nucleicAcid = {};
    } else if (newClass === 'mixture') {
      substance.mixture = {};
    } else if (newClass === 'structurallyDiverse') {
      substance.structurallyDiverse = {
        part: ['whole'],
        $$diverseType: 'whole'
      };
    } else if (newClass === 'specifiedSubstanceG1') {
      substance.structurallyDiverse = {
        part: ['whole'],
        $$diverseType: 'whole'
      };
    } else if (newClass === 'polymer') {
      substance.polymer = {
        idealizedStructure: {},
        monomers: [],
      };
    }
    alert('Substance type switched. Submit changes to save');
    return substance;
  }

  setDefinitionPrivate() {
    if (this.substance.structurallyDiverse) {
      this.setPrivate(this.substance.structurallyDiverse);
    } else if (this.substance.protein) {
      this.setPrivate(this.substance.protein);
    } else if (this.substance.structure) {
      this.setPrivate(this.substance.structure);
    } else if (this.substance.mixture) {
      this.setPrivate(this.substance.mixture);
    } else if (this.substance.polymer) {
      this.setPrivate(this.substance.polymer);
    } else if (this.substance.nucleicAcid) {
      this.setPrivate(this.substance.nucleicAcid);
    } else if (this.substance.specifiedSubstance) {
      this.setPrivate(this.substance.specifiedSubstance);
    } else {
    }
  }
   setPrivate(e) {
      e.access = ['protected'];
      alert('Substance definition now set to protected, please submit to save change');
    }


  setDefinitionPublic() {

    if (this.substance.structurallyDiverse) {
      this.setPublic(this.substance.structurallyDiverse);
    } else if (this.substance.protein) {
      this.setPublic(this.substance.protein);
    } else if (this.substance.structure) {
      this.setPublic(this.substance.structure);
    } else if (this.substance.mixture) {
      this.setPublic(this.substance.mixture);
    } else if (this.substance.polymer) {
      this.setPublic(this.substance.polymer);
    } else if (this.substance.nucleicAcid) {
      this.setPublic(this.substance.nucleicAcid);
    } else if (this.substance.specifiedSubstance) {
      this.setPublic(this.substance.specifiedSubstance);
    } else {
    }
  }

  conceptNonApproved() {
    if (this.substance.substanceClass === 'concept') {
      this.substance.status = 'non-approved';
      alert('Concept status set to "non approved", please submit to save changes');
    } else {
      alert('Can only change status of concept records');
    }
  }

unapproveRecord() {
    const old = this.substance.approvalID;
    this.substance.approvalID = null;
    this.substance.status = null;
    this.substance.approved = null;
    this.substance.approvedBy = null;
  alert('Removed approvalID \'' + old + '\'. Submit record to save.');
  }

  setPublic(e) {
    e.access = [];
    alert('Substance definition set to be PUBLIC, please submit to save change');
  }

  get isSubstanceUpdated(): boolean {
    const substanceString = JSON.stringify(this.substance);
    return this.substanceStateHash !== this.utilsService.hashCode(substanceString);
  }

  // Definition Start

  get definition(): Observable<SubstanceFormDefinition> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        const definition = this.getDefinition();
        observer.next(this.getDefinition());
        // tslint:disable-next-line:no-shadowed-variable
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
    this.substance.created = definition.created;
    this.substance.createdBy = definition.createdBy;
    this.substance.lastEdited = definition.lastEdited;
    this.substance.lastEditedBy = definition.lastEditedBy;
    if (definition.status) {
      this.substance.status = definition.status;
    }
    if (this.substance[definition.substanceClass]) {
      this.substance[definition.substanceClass].references = definition.references;
    } else {
      this.substance[definition.substanceClass] = {
        references: definition.references
      };
    }
  }

  getJson() {
    return this.substance;
  }

  getUuid(): string {
    return this.substance.uuid;
  }

  changeStatus(status: string): void {
    this.substance.status = status;
    alert('Status changed to ' + status);
  }

  private getDefinition(): SubstanceFormDefinition {

    if (!this.substance[this.subClass]) {
      this.substance[this.subClass] = {
        references: []
      };
      const substanceString = JSON.stringify(this.substance);
      this.substanceStateHash = this.utilsService.hashCode(substanceString);
    }

    if (!this.substance[this.subClass].references) {
      this.substance[this.subClass].references = [];
      const substanceString = JSON.stringify(this.substance);
      this.substanceStateHash = this.utilsService.hashCode(substanceString);
    }



    const definition: SubstanceFormDefinition = {
      uuid: this.substance[this.subClass].uuid || this.substance[this.subClass].id,
      substanceClass: this.subClass,
      definitionType: this.substance.definitionType,
      definitionLevel: this.substance.definitionLevel,
      deprecated: this.substance.deprecated,
      references: this.substance[this.subClass].references,
      access: this.substance.access,
      relationships: this.substance.relationships,
      created: this.substance.created,
      createdBy: this.substance.createdBy,
      lastEdited: this.substance.lastEdited,
      lastEditedBy: this.substance.lastEditedBy,
      _name: this.substance._name
    };
    if (this.substance.status) {
      definition.status = this.substance.status;
    }

    return definition;
  }

  // Definition end


  get allSites(): Observable<Array<DisplaySite>> {
    return new Observable(observer => {
      if (!this.allSitesArr) {
        this.allSitesArr = this.getAllSites();
      }
      observer.next(this.allSitesArr);
      this.allSitesEmitter.subscribe(sites => {
        observer.next(this.allSitesArr);
      });
    });
  }

  emitAllsitesUpdate(): void {
    this.allSitesEmitter.next(this.getAllSites());
  }


  getAllSites(): Array<DisplaySite> {

    const allSitesArr = [];

    if (this.substance.substanceClass === 'protein') {
      if (this.substance.protein.disulfideLinks) {
        this.substance.protein.disulfideLinks.forEach(link => {
          if (link.sites) {
            link.sites.forEach(site => {
              if (site.subunitIndex && site.residueIndex) {
                const newLink: DisplaySite = {
                  residue: site.residueIndex,
                  subunit: site.subunitIndex,
                  type: 'disulfide'
                };
                allSitesArr.push(newLink);
              }
            });
          }
        });
      }
      if (this.substance.protein.otherLinks) {
        this.substance.protein.otherLinks.forEach(link => {
          if (link.sites) {
            link.sites.forEach(site => {
              if (site.subunitIndex && site.residueIndex) {
                const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'other'};
                allSitesArr.push(newLink);
              }
            });
          }
        });
      }
      if (this.substance.protein.glycosylation) {
        const glycosylation = this.substance.protein.glycosylation;
        if (glycosylation.CGlycosylationSites) {
          glycosylation.CGlycosylationSites.forEach(site => {
            const newLink: DisplaySite = {
              residue: site.residueIndex,
              subunit: site.subunitIndex,
              type: 'C-Glycosylation'
            };
            allSitesArr.push(newLink);
          });
        }
        if (glycosylation.NGlycosylationSites) {
          glycosylation.NGlycosylationSites.forEach(site => {
            const newLink: DisplaySite = {
              residue: site.residueIndex,
              subunit: site.subunitIndex,
              type: 'N-Glycosylation'
            };
            allSitesArr.push(newLink);
          });
        }

        if (glycosylation.OGlycosylationSites) {
          glycosylation.OGlycosylationSites.forEach(site => {
            if (site.subunitIndex && site.residueIndex) {
              const newLink: DisplaySite = {
                residue: site.residueIndex,
                subunit: site.subunitIndex,
                type: 'O-Glycosylation'
              };
              allSitesArr.push(newLink);
            }
          });
        }
      }
    }
    if (this.substance.modifications.structuralModifications) {
      this.substance.modifications.structuralModifications.forEach(mod => {
        if (mod.sites) {
          mod.sites.forEach(site => {
            if (site.subunitIndex && site.residueIndex) {
              const newLink: DisplaySite = {
                residue: site.residueIndex,
                subunit: site.subunitIndex,
                type: 'modification'
              };
              allSitesArr.push(newLink);
            }
          });
        }
      });
    }
    if (this.substance.properties) {
      this.substance.properties.forEach(prop => {
        if (prop.propertyType === 'PROTEIN FEATURE' || prop.propertyType === 'NUCLEIC ACID FEATURE') {
          const featArr = prop.value.nonNumericValue.split(';');
          featArr.forEach(f => {
            const sites = f.split('-');
            const subunitIndex = Number(sites[0].split('_')[0]);
            for (let i = Number(sites[0].split('_')[1]); i <= Number(sites[1].split('_')[1]); i++) {
              const newLink: DisplaySite = {residue: Number(i), subunit: subunitIndex, type: 'feature'};
              allSitesArr.push(newLink);
            }
          });
        }
      });
    }
    return allSitesArr;
  }

  // ### possibly use type to only partially calculate allsites?
  recalculateAllSites(type?: string): void {
    const newSites = this.getAllSites();
    if (newSites !== this.allSitesArr) {
      this.allSitesArr = newSites;
      this.allSitesEmitter.next(this.allSitesArr);
    }
  }

  resolvedName(mol: string): void {
    this.nameResolver.next(mol);
  }

  // Class start


  // Polymer start

  get substancePolymerClassification(): Observable<PolymerClassification> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.polymer.classification == null) {
          this.substance.polymer.classification = {};
        }
        observer.next(this.substance.polymer.classification );
        this.substancePolymerClassificationEmitter.subscribe(poly => {
          observer.next(this.substance.polymer.classification);
        });
      });
    });
  }

  get substanceSRUs(): Observable<Array<StructuralUnit>> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.polymer.structuralUnits == null) {
          this.substance.polymer.structuralUnits = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        } else {
          this.setSRUConnectivityDisplay(this.substance.polymer.structuralUnits);
        }
        observer.next(this.substance.polymer.structuralUnits );
        this.substanceSRUEmitter.subscribe(poly => {
          observer.next(this.substance.polymer.structuralUnits);
        });
      });
    });
  }

  deleteSubstanceSRU(unit: StructuralUnit): void {
    const subNameIndex = this.substance.polymer.structuralUnits.findIndex(subName => unit.$$deletedCode === subName.$$deletedCode);
    if (subNameIndex > -1) {
      this.substance.polymer.structuralUnits.splice(subNameIndex, 1);
      this.substanceMonomerEmitter.next(this.substance.polymer.structuralUnits);
    }
  }

  updateSRUs(SRUs: Array<StructuralUnit>): void {
    this.setSRUConnectivityDisplay(SRUs);
    this.substance.polymer.structuralUnits = SRUs;
    this.substanceSRUEmitter.next(this.substance.polymer.structuralUnits);
  }

  get substanceDisplayStructure(): Observable<PolymerClassification> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.polymer.displayStructure == null) {
          this.substance.polymer.displayStructure = {};
        }
        observer.next(this.substance.polymer.displayStructure );
        this.substanceIdealizedStructureEmitter.subscribe(poly => {
          observer.next(this.substance.polymer.displayStructure);
        });
      });
    });
  }

  get substanceMonomers(): Observable<Array<Monomer>> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.polymer.monomers == null) {
          this.substance.polymer.monomers = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.polymer.monomers );
        this.substanceMonomerEmitter.subscribe(poly => {
          observer.next(this.substance.polymer.monomers);
        });
      });
    });
  }

  addSubstanceMonomer(): void {
    const newMix: Monomer = {};
    this.substance.polymer.monomers.unshift(newMix);
    this.substanceNamesEmitter.next(this.substance.polymer.monomers);
  }

  deleteSubstanceMonomer(mix: Monomer): void {
    const subNameIndex = this.substance.polymer.monomers.findIndex(subName => mix.$$deletedCode === subName.$$deletedCode);
    if (subNameIndex > -1) {
      this.substance.polymer.monomers.splice(subNameIndex, 1);
      this.substanceMonomerEmitter.next(this.substance.polymer.monomers);
    }
  }


  get substanceProtein(): Observable<Protein> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.protein == null) {
          // ### figure out why only proteinType takes forever to load causing a console error
          this.substance.protein = {proteinType: ''};
        }
        observer.next(this.substance.protein);
        this.substanceProteinEmitter.subscribe(protein => {
          observer.next(this.substance.protein);
        });
      });
    });
  }



  updateProteinDetails(protein: Protein): void {
    this.substance.protein.proteinType = protein.proteinType;
    this.substance.protein.proteinSubType = protein.proteinSubType;
    this.substance.protein.sequenceOrigin = protein.sequenceOrigin;
    this.substance.protein.sequenceType = protein.sequenceType;
  }

  updateNucleicAcidDetails(acid: NucleicAcid): void {
    this.substance.nucleicAcid.nucleicAcidType = acid.nucleicAcidType;
    this.substance.nucleicAcid.nucleicAcidSubType = acid.nucleicAcidSubType;
    this.substance.nucleicAcid.sequenceOrigin = acid.sequenceOrigin;
    this.substance.nucleicAcid.sequenceType = acid.sequenceType;
  }

  get substanceNucleicAcid(): Observable<NucleicAcid> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.nucleicAcid == null) {
          this.substance.nucleicAcid = {nucleicAcidType: ''};

        }
        observer.next(this.substance.nucleicAcid);
        this.substanceNucleicAcidEmitter.subscribe(protein => {
          observer.next(this.substance.nucleicAcid);
        });
      });
    });
  }


  // structurally diverse start
  get substanceStructurallyDiverse(): Observable<StructurallyDiverse> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.structurallyDiverse == null) {
          this.substance.structurallyDiverse = {$$diverseType: 'whole', part: ['WHOLE']};
        }
        observer.next(this.substance.structurallyDiverse);
        this.substanceStructurallyDiverseEmitter.subscribe(mixture => {
          observer.next(this.substance.structurallyDiverse);
        });
      });
    });
  }

  emitStructurallyDiverseUpdate(): void {
    this.substanceStructurallyDiverseEmitter.next(this.substance.structurallyDiverse);
  }

  // mixture start

  get substanceMixture(): Observable<Mixture> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.mixture == null) {
          this.substance.mixture = {};
        }
        observer.next(this.substance.mixture);
        this.substanceMixtureEmitter.subscribe(mixture => {
          observer.next(this.substance.mixture);
        });
      });
    });
  }

  get substanceMixtureComponents(): Observable<Array<SubstanceName>> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.mixture.components == null) {
          this.substance.mixture.components = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.mixture.components);
        this.substanceMixtureComponentsEmitter.subscribe(names => {
          observer.next(this.substance.mixture.components);
        });
      });
    });
  }

  addSubstanceMixtureComponent(): void {
    const newMix: MixtureComponents = {};
    this.substance.mixture.components.unshift(newMix);
    this.substanceMixtureComponentsEmitter.next(this.substance.mixture.components);
  }

  deleteSubstanceMixtureComponent(mix: MixtureComponents): void {
    const subNameIndex = this.substance.mixture.components.findIndex(subName => mix.$$deletedCode === subName.$$deletedCode);
    if (subNameIndex > -1) {
      this.substance.mixture.components.splice(subNameIndex, 1);
      this.substanceMixtureComponentsEmitter.next(this.substance.mixture.components);
    }
  }

// Class end

  // References start

  get substanceReferences(): Observable<Array<SubstanceReference>> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.references == null) {
          this.substance.references = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
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
    this.substanceReferencesEmitter.next(this.substance.references);
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
    const subRefIndex = this.substance.references.findIndex(subReference => reference.$$deletedCode === subReference.$$deletedCode);
    if (subRefIndex > -1) {
      this.substance.references.splice(subRefIndex, 1);
      this.substanceReferencesEmitter.next(this.substance.references);
    }
  }

  emitReferencesUpdate(): void {
    this.substanceReferencesEmitter.next(this.substance.references);
  }

  // References end

  // Names start

  get substanceNames(): Observable<Array<SubstanceName>> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.names == null) {
          this.substance.names = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
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

  get substanceIdealizedStructure(): Observable<SubstanceStructure> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.polymer.idealizedStructure == null) {
          this.substance.polymer.idealizedStructure = {
            references: [],
            access: []
          };
          const substanceString = JSON.stringify(this.substance);
          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.polymer.idealizedStructure);
        this.substanceIdealizedStructureEmitter.subscribe(structure => {

          observer.next(this.substance.polymer.idealizedStructure);
        });
      });
    });
  }

  // Structure start

  get substanceStructure(): Observable<SubstanceStructure> {
    return new Observable(observer => {
      this.ready().subscribe(substance => {
        if (this.substance.structure == null) {
          this.substance.structure = {
            references: [],
            access: []
          };
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
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
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.moieties);
        this.substanceMoietiesEmitter.subscribe(moieties => {
          observer.next(this.substance.moieties);
        });
      });
    });
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

  // Structure end

  // Codes start

  get substanceCodes(): Observable<Array<SubstanceCode>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.codes == null) {
          this.substance.codes = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
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
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
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
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
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
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
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

  addSubstancePropertyFromFeature(feature: any): void {
    let type = 'NUCLEIC ACID FEATURE';
    if (this.substance.substanceClass === 'protein') {
      type = 'PROTEIN FEATURE';
    }
    const newProperty: SubstanceProperty = {
      value: {'nonNumericValue': feature.siteRange, 'type': 'Site Range'},
      propertyType: type,
      name: feature.name,
      references: [],
      access: []
    };
    this.substance.properties.unshift(newProperty);
    this.recalculateAllSites('features');
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

  // Subunits start

  get substanceSubunits(): Observable<Array<Subunit>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.substanceClass === 'protein') {
          if (!this.substance.protein.subunits) {
            this.substance.protein.subunits = [];
            const substanceString = JSON.stringify(this.substance);
            this.substanceStateHash = this.utilsService.hashCode(substanceString);
          }
          observer.next(this.substance.protein.subunits);
          this.substanceSubunitsEmitter.subscribe(subunits => {
            observer.next(this.substance.protein.subunits);
          });
        } else {
          if (!this.substance.nucleicAcid.subunits) {
            this.substance.nucleicAcid.subunits = [];
            const substanceString = JSON.stringify(this.substance);
            this.substanceStateHash = this.utilsService.hashCode(substanceString);
          }
          observer.next(this.substance.nucleicAcid.subunits);
          this.substanceSubunitsEmitter.subscribe(subunits => {
            observer.next(this.substance.nucleicAcid.subunits);
          });
        }
      });
    });
  }

  get subunitDisplaySequences(): Observable<Array<SubunitSequence>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (!this.displaySequences) {
          this.displaySequences = this.createSubunitDisplay();
        }
        observer.next(this.displaySequences);
        this.displaySequencesEmitter.subscribe(newDisplay => {
          this.displaySequences = newDisplay;
          observer.next(this.displaySequences);
        });
      });
    });
  }


  addSubstanceSubunit(): void {
    if (this.substance.substanceClass === 'protein') {
      const index: number = this.substance.protein.subunits.length + 1;
      const newSubunit: Subunit = {
        references: [],
        access: [],
        sequence: '',
        subunitIndex: index
      };
      this.substance.protein.subunits.push(newSubunit);
      this.displaySequencesEmitter.next(this.createSubunitDisplay());
      this.substanceSubunitsEmitter.next(this.substance.protein.subunits);
    } else {
      let index = this.substance.nucleicAcid.subunits.length || 0;
      index = index + 1;
      const newSubunit: Subunit = {
        references: [],
        access: [],
        sequence: '',
        subunitIndex: index
      };
      this.substance.nucleicAcid.subunits.push(newSubunit);
      this.displaySequencesEmitter.next(this.createSubunitDisplay());
      this.substanceSubunitsEmitter.next(this.substance.nucleicAcid.subunits);
      this.emitSugarUpdate();
      this.emitLinkUpdate();
    }

  }

  deleteSubstanceSubunit(subunit: Subunit): void {
    if (this.substance.substanceClass === 'protein') {
      const subUnitIndex = this.substance.protein.subunits.findIndex(subUnit => subunit.subunitIndex === subUnit.subunitIndex);
      if (subUnitIndex > -1) {
        this.rearrangeSubunitIndexes('protein', subunit.subunitIndex);
        this.displaySequencesEmitter.next(this.createSubunitDisplay());
        this.substanceSubunitsEmitter.next(this.substance.protein.subunits);
      }
    } else {
      const subUnitIndex = this.substance.nucleicAcid.subunits.findIndex(subUnit => subunit.subunitIndex === subUnit.subunitIndex);
      if (subUnitIndex > -1) {
        this.rearrangeNAIndexes('nucleicAdid', subunit.subunitIndex);
        this.displaySequencesEmitter.next(this.createSubunitDisplay());
        this.substanceSubunitsEmitter.next(this.substance.nucleicAcid.subunits);
        this.emitSugarUpdate();
        this.emitLinkUpdate();
      }
    }

  }

  rearrangeNAIndexes(type: string, index: number) {
    const arrIndex = this.substance.nucleicAcid.subunits.findIndex(subUnit => index === subUnit.subunitIndex);
    this.substance.nucleicAcid.subunits.splice(arrIndex, 1);
    if (this.substance.nucleicAcid.subunits.length > (arrIndex - 1)) {
      this.substance.nucleicAcid.subunits.forEach(subunit => {
        if (subunit.subunitIndex > index) {

          const newIndex = subunit.subunitIndex - 1;
          subunit.subunitIndex = newIndex;
        }
      });
      if (this.substance.nucleicAcid.sugars) {
        this.substance.nucleicAcid.sugars.forEach(link => {
          if (link.sites) {
            link.sites = link.sites.filter(site => (site.subunitIndex !== index));
            link.sites.forEach(site => {
              if (site.subunitIndex && (site.subunitIndex > index)) {
                site.subunitIndex = site.subunitIndex - 1;
              }
            });
          }
        });
        this.emitSugarUpdate();
      }
      if (this.substance.nucleicAcid.linkages) {
        this.substance.nucleicAcid.linkages.forEach(link => {
          if (link.sites) {
            link.sites = link.sites.filter(site => (site.subunitIndex !== index));
            link.sites.forEach(site => {
              if (site.subunitIndex && (site.subunitIndex > index)) {
                site.subunitIndex = site.subunitIndex - 1;
              }
            });
          }
        });
        this.emitSugarUpdate();
      }
    }
  }

  rearrangeSubunitIndexes(type: string, index: number) {
    const arrIndex = this.substance.protein.subunits.findIndex(subUnit => index === subUnit.subunitIndex);
    this.substance.protein.subunits.splice(arrIndex, 1);
    if (this.substance.protein.subunits.length > (arrIndex - 1)) {
      this.substance.protein.subunits.forEach(subunit => {
        if (subunit.subunitIndex > index) {

          const newIndex = subunit.subunitIndex - 1;
          subunit.subunitIndex = newIndex;
        }
      });
      if (this.substance.protein.disulfideLinks) {
        this.substance.protein.disulfideLinks.forEach(link => {
          if (link.sites) {
            link.sites.forEach(site => {
              if (site.subunitIndex === index) {
                site = {};
              }
              if (site.subunitIndex && (site.subunitIndex > index)) {
                site.subunitIndex = site.subunitIndex - 1;
              }
            });
          }
        });

        this.emitDisulfideLinkUpdate();
      }
      if (this.substance.protein.otherLinks) {
        this.substance.protein.otherLinks.forEach(link => {
          if (link.sites) {
            link.sites = link.sites.filter(site => (site.subunitIndex !== index));
            link.sites.forEach(site => {
              if (site.subunitIndex && (site.subunitIndex > index)) {
                site.subunitIndex = site.subunitIndex - 1;
              }
            });
          }
        });
        this.emitOtherLinkUpdate();
      }
      if (this.substance.protein.glycosylation) {
        const glycosylation = this.substance.protein.glycosylation;
        if (glycosylation.CGlycosylationSites) {
          glycosylation.CGlycosylationSites = glycosylation.CGlycosylationSites.filter(site => (site.subunitIndex !== index));
          glycosylation.CGlycosylationSites.forEach(site => {
            if (site.subunitIndex && (site.subunitIndex > index)) {
              site.subunitIndex = site.subunitIndex - 1;
            }
          });
        }
        if (glycosylation.NGlycosylationSites) {
          glycosylation.NGlycosylationSites = glycosylation.NGlycosylationSites.filter(site => (site.subunitIndex !== index));
          glycosylation.NGlycosylationSites.forEach(site => {
            if (site.subunitIndex && (site.subunitIndex > index)) {
              site.subunitIndex = site.subunitIndex - 1;
            }
          });
        }

        if (glycosylation.OGlycosylationSites) {
          glycosylation.OGlycosylationSites = glycosylation.OGlycosylationSites.filter(site => (site.subunitIndex !== index));
          glycosylation.OGlycosylationSites.forEach(site => {
            if (site.subunitIndex && (site.subunitIndex > index)) {
              site.subunitIndex = site.subunitIndex - 1;
            }
          });
        }
        this.emitGlycosylationUpdate();
      }
      if (this.substance.modifications.structuralModifications) {
        this.substance.modifications.structuralModifications.forEach(link => {
          if (link.sites) {
            link.sites = link.sites.filter(site => (site.subunitIndex !== index));
            link.sites.forEach(site => {
              if (site.subunitIndex && (site.subunitIndex > index)) {
                site.subunitIndex = site.subunitIndex - 1;
              }
            });
          }
        });
        this.emitStructuralModificationsUpdate();
      }
      if (this.substance.properties) {
        this.substance.properties.forEach(prop => {
          if (prop.propertyType === 'PROTEIN FEATURE' || prop.propertyType === 'NUCLEIC ACID FEATURE') {
            const featArr = prop.value.nonNumericValue.split(';');
            featArr.forEach(f => {
            });
          }
        });
      }
    }
  }

  emitSubunitUpdate(): void {
    if (this.substance.substanceClass === 'protein') {
      this.substanceSubunitsEmitter.next(this.substance.protein.subunits);
      this.displaySequencesEmitter.next(this.createSubunitDisplay());
    } else {
      this.substanceSubunitsEmitter.next(this.substance.nucleicAcid.subunits);
      this.displaySequencesEmitter.next(this.createSubunitDisplay());
      this.emitSugarUpdate();
      this.emitLinkUpdate();
    }
  }

  // subunits end

  // other links start

  get substanceOtherLinks(): Observable<Array<Link>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.protein.otherLinks == null) {
          this.substance.protein.otherLinks = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.protein.otherLinks);
        this.substanceOtherLinksEmitter.subscribe(otherLinks => {
          observer.next(this.substance.protein.otherLinks);
        });
      });
    });
  }

  addSubstanceOtherLink(): void {
    const newOtherLinks: Link = {
      references: [],
      access: []
    };
    this.substance.protein.otherLinks.unshift(newOtherLinks);
    this.substanceOtherLinksEmitter.next(this.substance.protein.otherLinks);
  }

  deleteSubstanceOtherLink(link: Link): void {
    const subLinkIndex = this.substance.protein.otherLinks.findIndex(subCode => link.$$deletedCode === subCode.$$deletedCode);
    if (subLinkIndex > -1) {
      this.substance.protein.otherLinks.splice(subLinkIndex, 1);
      this.substanceOtherLinksEmitter.next(this.substance.protein.otherLinks);
    }
  }

  emitOtherLinkUpdate(): void {
    this.recalculateAllSites('other');
    this.substanceOtherLinksEmitter.next(this.substance.protein.otherLinks);
  }

  // other links end

  // disulfide links start

  get substanceDisulfideLinks(): Observable<Array<DisulfideLink>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.protein.disulfideLinks == null) {
          this.substance.protein.disulfideLinks = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.protein.disulfideLinks);
        this.substanceDisulfideLinksEmitter.subscribe(disulfideLinks => {
          observer.next(this.substance.protein.disulfideLinks);
        });
      });
    });
  }

  addSubstanceDisulfideLink(): void {
    const newDisulfideLinks: DisulfideLink = {};
    this.substance.protein.disulfideLinks.unshift(newDisulfideLinks);
    this.substanceDisulfideLinksEmitter.next(this.substance.protein.disulfideLinks);
  }

  addCompleteDisulfideLinks(sites: any): void {
    sites.forEach(link => {
      const newSites = [{subunitIndex: link[0].subunitIndex, residueIndex: link[0].residueIndex},
        {subunitIndex: link[1].subunitIndex, residueIndex: link[1].residueIndex},
      ];
      const newDisulfideLinks: DisulfideLink = {
        sites:
        newSites
      };
      this.substance.protein.disulfideLinks.unshift(newDisulfideLinks);
    });
    this.emitDisulfideLinkUpdate();
  }

  deleteSubstanceDisulfideLink(disulfideLink: DisulfideLink): void {
    const subLinkIndex = this.substance.protein.disulfideLinks.findIndex(subLink => disulfideLink.$$deletedCode === subLink.$$deletedCode);
    if (subLinkIndex > -1) {
      this.substance.protein.disulfideLinks.splice(subLinkIndex, 1);
      this.emitDisulfideLinkUpdate();
    }
  }

  deleteAllDisulfideLinks(): void {
    this.substance.protein.disulfideLinks = [];
    this.emitDisulfideLinkUpdate();
  }

  emitDisulfideLinkUpdate(): void {
    this.recalculateAllSites('disulfide');
    this.substanceDisulfideLinksEmitter.next(this.substance.protein.disulfideLinks);
    this.recalculateCysteine();
  }

  // disulfide links end

  // Glycosylation start

  get substanceGlycosylation(): Observable<Glycosylation> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.protein.glycosylation == null) {
          this.substance.protein.glycosylation = {};
        }
        observer.next(this.substance.protein.glycosylation);
        this.substanceGlycosylationEmitter.subscribe(glycosylation => {
          observer.next(this.substance.protein.glycosylation);
        });
      });
    });
  }

  emitGlycosylationUpdate(): void {
    this.recalculateAllSites('glycosylation');
    this.substanceGlycosylationEmitter.next(this.substance.protein.glycosylation);
  }

  // Glycosylation end

  // modifications start

  get substanceAgentModifications(): Observable<Array<AgentModification>> {
    this.checkModifications();
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (!this.substance.modifications) {
          this.substance.modifications = {};
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        if (!this.substance.modifications.agentModifications) {
          this.substance.modifications.agentModifications = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.modifications.agentModifications);
        this.substanceAgentModificationsEmitter.subscribe(agentModifications => {
          observer.next(this.substance.modifications.agentModifications);
        });
      });
    });
  }

  addSubstanceAgentModification(): void {
    const newAgentModifications: AgentModification = {};
    this.substance.modifications.agentModifications.unshift(newAgentModifications);
    this.substanceAgentModificationsEmitter.next(this.substance.modifications.agentModifications);
  }

  deleteSubstanceAgentModification(agentModification: AgentModification): void {
    const agentModIndex = this.substance.modifications.agentModifications.findIndex(
      agentMod => agentModification.$$deletedCode === agentMod.$$deletedCode);
    if (agentModIndex > -1) {
      this.substance.modifications.agentModifications.splice(agentModIndex, 1);
      this.substanceAgentModificationsEmitter.next(this.substance.modifications.agentModifications);
    }
  }

// modifications end

// modifications start

  get substancePhysicalModifications(): Observable<Array<PhysicalModification>> {
    this.checkModifications();
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (!this.substance.modifications) {
          this.substance.modifications = {};
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        if (!this.substance.modifications.physicalModifications) {
          this.substance.modifications.physicalModifications = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.modifications.physicalModifications);
        this.substancePhysicalModificationsEmitter.subscribe(physicalModifications => {
          observer.next(this.substance.modifications.physicalModifications);
        });
      });
    });
  }

  addSubstancePhysicalModification(): void {
    const newPhysicalModifications: PhysicalModification = {};
    this.substance.modifications.physicalModifications.unshift(newPhysicalModifications);
    this.substancePhysicalModificationsEmitter.next(this.substance.modifications.physicalModifications);
  }

  deleteSubstancePhysicalModification(physicalModification: PhysicalModification): void {
    const physicalModIndex = this.substance.modifications.physicalModifications.findIndex(
      physicalMod => physicalModification.$$deletedCode === physicalMod.$$deletedCode);
    if (physicalModIndex > -1) {
      this.substance.modifications.physicalModifications.splice(physicalModIndex, 1);
      this.substancePhysicalModificationsEmitter.next(this.substance.modifications.physicalModifications);
    }
  }

// modifications end

  // modifications start

  get substanceStructuralModifications(): Observable<Array<StructuralModification>> {
    this.checkModifications();
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (!this.substance.modifications) {
          this.substance.modifications = {};
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        if (!this.substance.modifications.structuralModifications) {
          this.substance.modifications.structuralModifications = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.modifications.structuralModifications);
        this.substanceStructuralModificationsEmitter.subscribe(structuralModifications => {
          observer.next(this.substance.modifications.structuralModifications);
        });
      });
    });
  }

  addSubstanceStructuralModification(): void {
    this.checkModifications();
    const newStructuralModifications: StructuralModification = {references: []};
    this.substance.modifications.structuralModifications.unshift(newStructuralModifications);
    this.substanceStructuralModificationsEmitter.next(this.substance.modifications.structuralModifications);
  }

  deleteSubstanceStructuralModification(structuralModification: StructuralModification): void {
    const structuralModIndex = this.substance.modifications.structuralModifications.findIndex(
      structuralMod => structuralModification.$$deletedCode === structuralMod.$$deletedCode);
    if (structuralModIndex > -1) {
      this.substance.modifications.structuralModifications.splice(structuralModIndex, 1);
      this.substanceStructuralModificationsEmitter.next(this.substance.modifications.structuralModifications);
    }
  }

  emitStructuralModificationsUpdate(): void {
    if (this.substance.substanceClass === 'protein' || 'nucleic acid') {
      this.recalculateAllSites('glycosylation');
    }
    this.substanceStructuralModificationsEmitter.next(this.substance.modifications.structuralModifications);
  }




  checkModifications(): void {
    if (this.substance) {
      if (!this.substance.modifications || this.substance.modifications === null) {
        this.substance.modifications = {
          agentModifications: [],
          structuralModifications: [],
          physicalModifications: []
        };
        const substanceString = JSON.stringify(this.substance);

        this.substanceStateHash = this.utilsService.hashCode(substanceString);
      }
    }
  }

// modifications end

  // Cysteine start

  emitCysteineUpdate(cysteine: Array<Site>): void {
    this.substanceCysteineEmitter.next(cysteine);
  }

  recalculateCysteine(): void {
    let available = [];
    if (this.substance.substanceClass === 'protein') {
      for (let i = 0; i < this.substance.protein.subunits.length; i++) {
        const sequence = this.substance.protein.subunits[i].sequence;
        for (let j = 0; j < sequence.length; j++) {
          const site = sequence[j];
          if (site.toUpperCase() === 'C') {
            available.push({'residueIndex': (j + 1), 'subunitIndex': (i + 1)});
          }
        }
      }

      this.substance.protein.disulfideLinks.forEach(link => {
        if (link.sites) {
          link.sites.forEach(site => {
            available = available.filter(r => (r.residueIndex !== site.residueIndex) || (r.subunitIndex !== site.subunitIndex));
          });
        }
      });
    }
    this.substanceCysteineEmitter.next(available);
  }

  get substanceCysteineSites(): Observable<Array<Site>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        let available = [];
        for (let i = 0; i < this.substance.protein.subunits.length; i++) {
          const sequence = this.substance.protein.subunits[i].sequence;
          for (let j = 0; j < sequence.length; j++) {
            const site = sequence[j];
            if (site.toUpperCase() === 'C') {
              available.push({'residueIndex': (j + 1), 'subunitIndex': (i + 1)});
            }
          }
        }

        this.substance.protein.disulfideLinks.forEach(link => {
          if (link.sites) {
            link.sites.forEach(site => {
              available = available.filter(r => (r.residueIndex !== site.residueIndex) || (r.subunitIndex !== site.subunitIndex));
            });
          }
        });
        this.cysteine = available;
        observer.next(available);
        this.substanceCysteineEmitter.subscribe(disulfideLinks => {
          this.cysteine = disulfideLinks;
          observer.next(disulfideLinks);
        });
      });
    });
  }


  // custom sites for proteins

  emitCustomFeaturesUpdate(): void {
    this.customFeaturesEmitter.next(this.customFeatures);
  }


  get CustomFeatures(): Observable<Array<Feature>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.customFeatures == null) {
          this.customFeatures = [];
        }
        observer.next(this.customFeatures);
        this.customFeaturesEmitter.subscribe(disulfideLinks => {
          observer.next(this.customFeatures);
        });
      });
    });
  }


  // ################################ Start Nucleic acid (break into new file, one for each class or on with only class specific?

  // begin link

  get substanceLinks(): Observable<Array<Linkage>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.nucleicAcid.linkages == null) {
          this.substance.nucleicAcid.linkages = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.nucleicAcid.linkages);
        this.substanceLinksEmitter.subscribe(links => {
          observer.next(this.substance.nucleicAcid.linkages);
        });
      });
    });
  }

  addSubstanceLink(): void {
    const newLinks: Linkage = {
      sites: []
    };
    this.substance.nucleicAcid.linkages.unshift(newLinks);
    this.substanceLinksEmitter.next(this.substance.nucleicAcid.linkages);
  }

  deleteSubstanceLink(link: Link): void {
    const subLinkIndex = this.substance.nucleicAcid.linkages.findIndex(subCode => link.$$deletedCode === subCode.$$deletedCode);
    if (subLinkIndex > -1) {
      this.substance.nucleicAcid.linkages.splice(subLinkIndex, 1);
      this.substanceLinksEmitter.next(this.substance.nucleicAcid.linkages);
    }
  }

  emitLinkUpdate(): void {
    this.substanceLinksEmitter.next(this.substance.nucleicAcid.linkages);
  }


  // begin sugars

  get substanceSugars(): Observable<Array<Sugar>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.nucleicAcid.sugars == null) {
          this.substance.nucleicAcid.sugars = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.nucleicAcid.sugars);
        this.substanceSugarsEmitter.subscribe(sugars => {
          observer.next(this.substance.nucleicAcid.sugars);
        });
      });
    });
  }

  addSubstanceSugar(): void {
    const newSugars: Sugar = {
      sites: [],
      sugar: ''
    };
    this.substance.nucleicAcid.sugars.unshift(newSugars);
    this.substanceSugarsEmitter.next(this.substance.nucleicAcid.sugars);
  }

  deleteSubstanceSugar(sugar: Sugar): void {
    const subSugarIndex = this.substance.nucleicAcid.sugars.findIndex(subCode => sugar.$$deletedCode === subCode.$$deletedCode);
    if (subSugarIndex > -1) {
      this.substance.nucleicAcid.sugars.splice(subSugarIndex, 1);
      this.substanceSugarsEmitter.next(this.substance.nucleicAcid.sugars);
    }
  }

  emitSugarUpdate(): void {
    this.substanceSugarsEmitter.next(this.substance.nucleicAcid.sugars);
  }

  // end sugars

  // start constituents

  get substanceConstituents(): Observable<Array<Constituent>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.substance.specifiedSubstance.constituents == null) {
          this.substance.specifiedSubstance.constituents = [];
          const substanceString = JSON.stringify(this.substance);

          this.substanceStateHash = this.utilsService.hashCode(substanceString);
        }
        observer.next(this.substance.specifiedSubstance.constituents);
        this.substanceConstituentsEmitter.subscribe(sugars => {
          observer.next(this.substance.specifiedSubstance.constituents);
        });
      });
    });
  }

  addSubstanceConstituent(): void {
    const constituent: Constituent = {};
    this.substance.specifiedSubstance.constituents.unshift(constituent);
    this.substanceConstituentsEmitter.next(this.substance.specifiedSubstance.constituents);
  }

  deleteSubstanceConstituent(sugar: Sugar): void {
    const constituentIndex = this.substance.specifiedSubstance.constituents.findIndex(
      subCode => sugar.$$deletedCode === subCode.$$deletedCode);
    if (constituentIndex > -1) {
      this.substance.specifiedSubstance.constituents.splice(constituentIndex, 1);
      this.substanceConstituentsEmitter.next(this.substance.specifiedSubstance.constituents);
    }
  }

  emitConstituentUpdate(): void {
    this.substanceConstituentsEmitter.next(this.substance.specifiedSubstance.constituents);
  }

  // end constituents

  // start change reason

  get changeReason(): Observable<string> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        observer.next(this.substance.changeReason);
        this.substanceChangeReasonEmitter.subscribe(changeReason => {
          observer.next(this.substance.changeReason);
        });
      });
    });
  }

  updateChangeReason(changeReason: string): void {
    this.substance.changeReason = changeReason;
    this.substanceChangeReasonEmitter.next(this.substance.changeReason);
  }

  // end change reason

  validateSubstance(): Observable<ValidationResults> {
    return new Observable(observer => {
      const substanceCopy = this.cleanSubstance();
      this.substanceService.validateSubstance(substanceCopy).subscribe(results => {
        observer.next(results);
        observer.complete();
      }, error => {
        observer.error();
        observer.complete();
      });
    });
  }

  cleanSubstance(): SubstanceDetail {
    if (this.substance.structurallyDiverse) {
      if (this.substance.structurallyDiverse.$$diverseType) {
        delete this.substance.structurallyDiverse.$$diverseType;
      }
      if (this.substance.structurallyDiverse.$$storedPart) {
        delete this.substance.structurallyDiverse.$$storedPart;
      }
    }

      let substanceString = JSON.stringify(this.substance);
    let substanceCopy: SubstanceDetail = JSON.parse(substanceString);
    const deletablekeys = [
      'names',
      'codes',
      'relationships',
      'notes',
      'properties',
      'references'
    ];
    const deletedReferenceUuids = [];

    deletablekeys.forEach(property => {
      if (substanceCopy[property] && substanceCopy[property].length) {

        substanceCopy[property] = substanceCopy[property].filter((item: any) => {

          const hasDeleletedCode = item.$$deletedCode != null;
          if (!hasDeleletedCode) {
            delete item.$$deletedCode;
          } else if (property === 'references') {
            deletedReferenceUuids.push(item.uuid);
          }
          return !hasDeleletedCode;
        });
      }
    });

    this.structuralModCommentToRef();

    let substanceString = JSON.stringify(this.substance);
    let substanceCopy: SubstanceDetail = JSON.parse(substanceString);

    const response = this.cleanObject(substanceCopy);
    console.log(substanceCopy);
    console.log(response);
    const deletedUuids = response.deletedUuids;
    // const deletablekeys = [
    //   'names',
    //   'codes',
    //   'relationships',
    //   'notes',
    //   'properties',
    //   'references',
    //   'polymer.monomers'
    // ];
    // const deletedReferenceUuids = [];

    // deletablekeys.forEach(deletableKey => {
    //   if (substanceCopy[deletableKey] && substanceCopy[deletableKey].length) {
    //     substanceCopy[deletableKey] = substanceCopy[deletableKey].filter((item: any) => {

    //       const hasDeleletedCode = item.$$deletedCode != null;
    //       if (!hasDeleletedCode) {
    //         delete item.$$deletedCode;
    //       } else if (deletableKey === 'references') {
    //         deletedReferenceUuids.push(item.uuid);
    //       }
    //       return !hasDeleletedCode;
    //     });
    //   }
    // });



    if (deletedUuids.length > 0) {
      substanceString = JSON.stringify(substanceCopy);

      deletedUuids.forEach(uuid => {
        substanceString = substanceString.replace(new RegExp(`"${uuid}"`, 'g'), '');
      });
      substanceString = substanceString.replace(/,,/g, ',');
      substanceString = substanceString.replace(/\[,/g, '[');
      substanceString = substanceString.replace(/,\]/g, ']');
      substanceCopy = JSON.parse(substanceString);
    }

    return substanceCopy;
  }

  private cleanObject(substanceProperty: any, deletedUuids: Array<string> = []): { deletedUuids: Array<string>, isDeleted: boolean } {
    if (Object.prototype.toString.call(substanceProperty) === '[object Object]') {

      const hasDeleletedCode = substanceProperty.$$deletedCode != null;
      if (!hasDeleletedCode) {
        delete substanceProperty.$$deletedCode;
        Object.keys(substanceProperty).forEach(key => {
          if (Object.prototype.toString.call(substanceProperty[key]) === '[object Array]') {
            substanceProperty[key] = substanceProperty[key].filter(childProperty => {
              const response = this.cleanObject(childProperty, deletedUuids);
              return !response.isDeleted;
            });
          } else if (Object.prototype.toString.call(substanceProperty[key]) === '[object Object]') {
            this.cleanObject(substanceProperty[key], deletedUuids);
          }
        });
      } else if (substanceProperty.uuid != null) {
        deletedUuids.push(substanceProperty.uuid);
      }

      return {
        deletedUuids: deletedUuids,
        isDeleted: hasDeleletedCode
      };
    } else if (Object.prototype.toString.call(substanceProperty) === '[object Array]') {
      substanceProperty.forEach(childProperty => {
        this.cleanObject(childProperty, deletedUuids);
      });
    } else {
      return {
        deletedUuids: deletedUuids,
        isDeleted: false
      };
    }
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

      const substanceCopy = this.cleanSubstance();
      this.substanceService.saveSubstance(substanceCopy).subscribe(substance => {
        this.substance = substance;
        results.uuid = substance.uuid;
        this.definitionEmitter.next(this.getDefinition());
        if (this.substance.substanceClass === 'protein') {
          this.substanceOtherLinksEmitter.next(this.substance.protein.otherLinks);
          this.substanceDisulfideLinksEmitter.next(this.substance.protein.disulfideLinks);
          this.substanceGlycosylationEmitter.next(this.substance.protein.glycosylation);
          this.substanceSubunitsEmitter.next(this.substance.protein.subunits);
        } else if (this.substance.substanceClass === 'nucleicAcid') {
          this.substanceLinksEmitter.next(this.substance.nucleicAcid.linkages);
          this.substanceSugarsEmitter.next(this.substance.nucleicAcid.sugars);
          this.substanceSubunitsEmitter.next(this.substance.nucleicAcid.subunits);
        } else if (this.substance.substanceClass === 'mixture') {
          this.substanceMixtureEmitter.next(this.substance.mixture);
          this.substanceSubunitsEmitter.next(this.substance.mixture.components);
        } else if (this.substance.substanceClass === 'structurallyDiverse') {
          this.substanceStructurallyDiverseEmitter.next(this.substance.structurallyDiverse);
        }
        this.substanceReferencesEmitter.next(this.substance.references);
        this.domainsWithReferencesEmitter.next(this.getDomainReferences());
        this.substanceNamesEmitter.next(this.substance.names);
        this.substanceStructureEmitter.next(this.substance.structure);
        this.substanceMoietiesEmitter.next(this.substance.moieties);
        this.substanceCodesEmitter.next(this.substance.codes);
        this.substanceRelationshipsEmitter.next(this.substance.relationships);
        this.substanceNamesEmitter.next(this.substance.notes);
        this.substancePropertiesEmitter.next(this.substance.properties);
        if (this.substance.modifications) {
          this.substanceAgentModificationsEmitter.next(this.substance.modifications.agentModifications);
          this.substancePhysicalModificationsEmitter.next(this.substance.modifications.physicalModifications);
          this.substanceStructuralModificationsEmitter.next(this.substance.modifications.structuralModifications);

        }
        this.substanceChangeReasonEmitter.next(this.substance.changeReason);
        this.substanceStateHash = this.utilsService.hashCode(this.substance);
        observer.next(results);
        observer.complete();
      }, error => {
        results.isSuccessfull = false;
        if (error && error.error && error.error.validationMessages) {
          results.validationMessages = error.error.validationMessages;
        } else {
          results.serverError = error;
        }
        observer.error(results);
        observer.complete();
      });
    });
  }

  siteDisplayToSite(site) {
    const subres = site.split('_');

    if (site.match(/^[0-9][0-9]*_[0-9][0-9]*$/g) === null) {
      throw new Error('"' + site + '" is not a valid shorthand for a site. Must be of form "{subunit}_{residue}"');
    }

    return {
      subunitIndex: subres[0] - 0,
      residueIndex: subres[1] - 0
    };
  }

  stringToSites(slist: string): Array<Site> {
    slist = slist.replace(/ /g, '');
    if (!slist) {
      return [];
    }
    const toks = slist.split(';');
    const sites = [];
    // tslint:disable-next-line:forin
    for (const i in toks) {
      const l = toks[i];
      if (l === '') {
        continue;
      }
      const rng = l.split('-');
      if (rng.length > 1) {
        const site1 = this.siteDisplayToSite(rng[0]);
        const site2 = this.siteDisplayToSite(rng[1]);
        if (site1.subunitIndex !== site2.subunitIndex) {
          throw new Error('"' + rng + '" is not a valid shorthand for a site range. Must be between the same subunits.');
        }
        if (site2.residueIndex <= site1.residueIndex) {
          throw new Error('"' + rng + '" is not a valid shorthand for a site range. Second residue index must be greater than first.');
        }
        sites.push(site1);
        for (let j = site1.residueIndex + 1; j < site2.residueIndex; j++) {
          sites.push({
            subunitIndex: site1.subunitIndex,
            residueIndex: j
          });
        }
        sites.push(site2);
      } else {
        sites.push(this.siteDisplayToSite(rng[0]));
      }
    }
    return sites;
  }

  addAnySiteType(data: any) {
    if (data.siteType === 'feature') {
      this.addSubstancePropertyFromFeature(data.sentFeature);
    } else if (data.siteType === 'other') {

    } else if (data.siteType === 'CGlycosylation') {
      this.substance.protein.glycosylation.CGlycosylationSites =
        this.substance.protein.glycosylation.CGlycosylationSites.concat(data.links);
      this.emitGlycosylationUpdate();
    } else if (data.siteType === 'NGlycosylation') {
      this.substance.protein.glycosylation.NGlycosylationSites =
        this.substance.protein.glycosylation.NGlycosylationSites.concat(data.links);
      this.emitGlycosylationUpdate();
    } else if (data.siteType === 'OGlycosylation') {
      this.substance.protein.glycosylation.OGlycosylationSites =
        this.substance.protein.glycosylation.OGlycosylationSites.concat(data.links);
      this.emitGlycosylationUpdate();
    } else if (data.siteType === 'disulfide') {
      const newLink: Link = {sites: data.links};
      this.substance.protein.disulfideLinks.unshift(newLink);
      this.emitDisulfideLinkUpdate();

    } else if (data.siteType === 'modification') {

    }
  }

  siteString(sites: Array<Site>): string {

    if (!sites || sites.length === 0) {
      return '';
    }
    if (sites.length === 1) {
      return sites[0].subunitIndex + '_' + sites[0].residueIndex;
    }
    {
      sites.sort(function (site1, site2) {
        let d = site1.subunitIndex - site2.subunitIndex;
        if (d === 0) {
          d = site1.residueIndex - site2.residueIndex;
        }
        return d;

      });
      let csub = 0;
      let cres = 0;
      let rres = 0;
      let finish = false;
      let disp = '';
      for (let i = 0; i < sites.length; i++) {

        const site = sites[i];
        if (site.subunitIndex === csub && site.residueIndex === cres) {
          continue;
        }
        finish = false;
        if (site.subunitIndex === csub) {
          if (site.residueIndex === cres + 1) {
            if (rres === 0) {
              rres = cres;
            }
          } else {
            finish = true;
          }
        } else {
          finish = true;
        }
        if (finish && csub !== 0) {
          if (rres !== 0) {
            disp += csub + '_' + rres + '-' + csub + '_' + cres + '; ';
          } else {
            disp += csub + '_' + cres + '; ';
          }
          rres = 0;
        }
        csub = site.subunitIndex;
        cres = site.residueIndex;
      }
      if (sites.length > 0) {
        if (rres !== 0) {
          disp += csub + '_' + rres + '-' + csub + '_' + cres;
        } else {
          disp += csub + '_' + cres;
        }
      }
      return disp;
    }
  }

  createSubunitDisplay(): Array<SubunitSequence> {
    let subunits = [];
    if (this.substance.substanceClass === 'protein') {
      subunits = this.substance.protein.subunits;
    } else {
      subunits = this.substance.nucleicAcid.subunits;
    }
    const t0 = performance.now();
    const subunitSequences = [];
    let subunitIndex = 1;
    subunits.forEach(subunit => {
      const subsections = [];
      let currentSections = [];
      for (let count = 0; count < subunit.sequence.length; count = count + 10) {
        if ((count + 10) >= subunit.sequence.length) {
          currentSections.push([count, subunit.sequence.length]);
          if ((count + 10) % 50 !== 0) {
            subsections.push(currentSections);
          }
        } else {
          currentSections.push([count, count + 10]);
        }
        if ((count + 10) % 50 === 0) {
          subsections.push(currentSections);
          currentSections = [];
        }
      }
      const thisTest: TestSequence = {
        subunitIndex: subunitIndex,
        subunits: [],
        subsections: subsections,
        subgroups: currentSections
      };
      let index = 0;
      const indexEnd = subunit.sequence.length;
      while (index <= indexEnd) {
        if (subunit.sequence[index]) {
          const sequenceUnit: SequenceUnit = {
            unitIndex: index + 1,
            unitValue: subunit.sequence[index],
            class: ''
          };
          thisTest.subunits.push(sequenceUnit);
        }
        index++;
      }
      subunitSequences.push(thisTest);
      subunitIndex++;
    });
    // this.addStyle();
    const t1 = performance.now();
    const totaltime = t1 - t0;
    return subunitSequences;
  }

  standardizeNames() {
    const bad = /[^ -~\t\n\r]/g;
    const rep = '\u2019;\';\u03B1;.ALPHA.;\u03B2;.BETA.;\u03B3;.GAMMA.;\u03B4;.DELTA.;\u03B5;.EPSILON.;\u03B6;.ZETA.;\u03B7;.ETA.;\u03B8;.THETA.;\u03B9;.IOTA.;\u03BA;.KAPPA.;\u03BB;.LAMBDA.;\u03BC;.MU.;\u03BD;.NU.;\u03BE;.XI.;\u03BF;.OMICRON.;\u03C0;.PI.;\u03C1;.RHO.;\u03C2;.SIGMA.;\u03C3;.SIGMA.;\u03C4;.TAU.;\u03C5;.UPSILON.;\u03C6;.PHI.;\u03C7;.CHI.;\u03C8;.PSI.;\u03C9;.OMEGA.;\u0391;.ALPHA.;\u0392;.BETA.;\u0393;.GAMMA.;\u0394;.DELTA.;\u0395;.EPSILON.;\u0396;.ZETA.;\u0397;.ETA.;\u0398;.THETA.;\u0399;.IOTA.;\u039A;.KAPPA.;\u039B;.LAMBDA.;\u039C;.MU.;\u039D;.NU.;\u039E;.XI.;\u039F;.OMICRON.;\u03A0;.PI.;\u03A1;.RHO.;\u03A3;.SIGMA.;\u03A4;.TAU.;\u03A5;.UPSILON.;\u03A6;.PHI.;\u03A7;.CHI.;\u03A8;.PSI.;\u03A9;.OMEGA.;\u2192;->;\xB1;+/-;\u2190;<-;\xB2;2;\xB3;3;\xB9;1;\u2070;0;\u2071;1;\u2072;2;\u2073;3;\u2074;4;\u2075;5;\u2076;6;\u2077;7;\u2078;8;\u2079;9;\u207A;+;\u207B;-;\u2080;0;\u2081;1;\u2082;2;\u2083;3;\u2084;4;\u2085;5;\u2086;6;\u2087;7;\u2088;8;\u2089;9;\u208A;+;\u208B;-'.split(';');
    const map = {};
    for (let s = 0; s < rep.length; s++) {
      if (s % 2 === 0) {
        const id = rep[s].charCodeAt(0);
        map[id] = rep[s + 1];
      }
    }

    function replacer(match, got) {
      return map[got.charCodeAt(0)];
    }

    this.substance.names.forEach(n => {
      if (n.name) {
        let name = n.name;
        name = name.replace(/([\u0390-\u03C9||\u2192|\u00B1-\u00B9|\u2070-\u208F|\u2190|])/g, replacer).trim();
        name = name.replace(bad, '');
        name = name.replace(/[[]([A-Z -.]*)\]$/g, ' !!@!$1_!@!');
        name = name.replace(/[ \t]+/g, ' ');
        name = name.replace(/[[]/g, '(');
        name = name.replace(/[{]/g, '(');
        name = name.replace(/\]/g, ')');
        name = name.replace(/\"/g, '\'\'');
        name = name.replace(/[}]/g, ')');
        name = name.replace(/\(([0-9]*CI,)*([0-9]*CI)\)$/gm, '');
        name = name.replace(/[ ]*-[ ]*/g, '-');
        name = name.trim();
        name = name.replace('!!@!', '[');
        name = name.replace('_!@!', ']');
        n.name = name.toUpperCase();
      }
    });
    this.substanceNamesEmitter.next(this.substance.names);
  }


  getAttachmentMapUnits(srus: any) {
    const rmap = {};
    // tslint:disable-next-line:forin
    for (const i in srus) {
      let lab = srus[i].label;
      if (!lab) {
        lab = '{' + i + '}';
      }
      for (const k in srus[i].attachmentMap) {
        if (srus[i].attachmentMap.hasOwnProperty(k)) {
          rmap[k] = lab;
        }
      }
    }
    return rmap;
  }
  sruConnectivityToDisplay(amap: any, rmap: any) {
    let disp = '';
    for (const k in amap) {
      if (amap.hasOwnProperty(k)) {
        const start = rmap[k] + '_' + k;
        // tslint:disable-next-line:forin
        for (const i in amap[k]) {
          const end = rmap[amap[k][i]] + '_' + amap[k][i];
          disp += start + '-' + end + ';\n';
        }
      }
    }
    if (disp === '') { return undefined; }
    return disp;
  }
  sruDisplayToConnectivity(display: any) {
    if (!display) {
      return {};
    }
    const errors = [];
    const connections = display.split(';');
    const regex = /^\s*[A-Za-z][A-Za-z]*[0-9]*_(R[0-9][0-9]*)[-][A-Za-z][A-Za-z]*[0-9]*_(R[0-9][0-9]*)\s*$/g;
    const map = {};
    for (let i = 0; i < connections.length; i++) {
      const con = connections[i].trim();
      if (con === '') { continue; }
      regex.lastIndex = 0;
      const res = regex.exec(con);
      if (res == null) {
        const text = 'Connection \'' + con + '\' is not properly formatted';
        errors.push({
          text: text,
          type: 'warning'
        });
      } else {
        if (!map[res[1]]) {
          map[res[1]] = [];
        }
        map[res[1]].push(res[2]);
      }
    }
    if (errors.length > 0) {
     // map.$errors = errors;
    }
    return map;
  }
  setSRUConnectivityDisplay(srus: any) {
    const rmap = this.getAttachmentMapUnits(srus);
    // tslint:disable-next-line:forin
    for (const i in srus) {
      const disp = this.sruConnectivityToDisplay(srus[i].attachmentMap, rmap);
      srus[i]._displayConnectivity = disp;
    }
  }


  disulfideLinks() {

    const KNOWN_DISULFIDE_PATTERNS = {};
    ('IGG4	0-1,11-12,13-31,14-15,18-19,2-26,20-21,22-23,24-25,27-28,29-30,3-4,5-16,6-17,7-8,9-10\n' + 'IGG2	0-1,11-12,13-14,15-35,16-17,2-30,22-23,24-25,26-27,28-29,3-4,31-32,33-34,5-18,6-19,7-20,8-21,9-10\n' + 'IGG1	0-1,11-12,13-14,15-31,18-19,2-3,20-21,22-23,24-25,27-28,29-30,4-26,5-16,6-17,7-8,9-10').split('\n').map(function (s) {
      const tup = s.split('\t');

      const list = _.chain(tup[1].split(',')).map(function (t) {
        return _.map(t.split('-'), function (temp) {
          return +temp - 0;
        });
      }).value();

      KNOWN_DISULFIDE_PATTERNS[tup[0]] = list;
    });
    const proteinSubstance = this.substance;
    const prot = proteinSubstance.protein;
    const pattern = KNOWN_DISULFIDE_PATTERNS[prot.proteinSubType];

    if (!pattern) {
      alert('Unknown disulfide pattern for protein subtype:"' + prot.proteinSubType + '"');
      return;
    } else {
      if (!confirm('Would you like to set the disulfide pattern for:"' + prot.proteinSubType + '"')) {
        return;
      }
    }
    let ng = '';
    let og = '';
    let cg = '';
    const realList = [];
    const cst = [];

    let cs = _.chain(prot.subunits).map(function (s) {
      const sid = s.subunitIndex;
      let i1 = 1;

      const v = _.chain(s.sequence).map(function (r) {
        return {
          'i': i1++,
          'r': r
        };
      }).filter(function (r) {
        return r.r === 'C';
      }).map(function (r) {
        return {
          'su': sid,
          'r': r.r,
          'ri': r.i
        };
      }).value();

      for (let i = 0; i < v.length; i++) {
        cst.push(v[i]);
      }

      return v;
    }).value();
    cs = cst;
    for (let i = 0; i < cs.length; i++) {
      const c1 = cs[i];
      const real: any = {};
      real.subunitIndex = c1['su'];
      real.residueIndex = c1['ri'];
      real.display = c1['su'] + '_' + c1['ri'];
      real.value = real.display;
      realList.push(real);
    }
    const newDS = _.chain(pattern).map(function (sl) {
      return [realList[sl[0]], realList[sl[1]]];
    }).map(function (s) {
      return {
        'sites': s,
        'sitesShorthand': s[0].display + ';' + s[1].display
      };
    }).value();

    if (prot.glycosylation) {
      if (prot.glycosylation.NGlycosylationSites) {
        const s = prot.glycosylation.NGlycosylationSites;
        ng =  _.chain(s).map(function (s1) {
          return s1.subunitIndex + '_' + s1.residueIndex;
        }).value().join(';');
      }

      if (prot.glycosylation.CGlycosylationSites) {
        const s = prot.glycosylation.CGlycosylationSites;
        cg = _.chain(s).map(function (s1) {
          return s1.subunitIndex + '_' + s1.residueIndex;
        }).value().join(';');
      }

      if (prot.glycosylation.OGlycosylationSites) {
        const s = prot.glycosylation.OGlycosylationSites;
        og = _.chain(s).map(function (s1) {
          return s1.subunitIndex + '_' + s1.residueIndex;
        }).value().join(';');
      }
    }

    this.substance.protein.disulfideLinks = newDS;
    this.emitDisulfideLinkUpdate();
    alert('Found and added ' + newDS.length + 'sites');



  }


  predictSites() {
    function setJson(json) {

    }

    function gfinder(sn, seq) {
      const re = new RegExp('N[^P][ST]', 'g');
      let xArray;
      const sites = [];

      while (xArray = re.exec(seq)) {
        const ri = xArray.index + 1;
        sites.push({
          subunitIndex: sn,
          residueIndex: ri
        });
      }

      return sites;
    }

    function proteinGlycFinder(proteinSubstance) {
      return _.chain(proteinSubstance.protein.subunits).flatMap(function (su) {
        return gfinder(su.subunitIndex, su.sequence);
      }).value();
    }

    const sub = this.substance;
    const gsites = proteinGlycFinder(sub);

    if (gsites.length === 0) {
      alert('No potential N-Glycosylation sites found');

    } else {
      alert('Found: ' + gsites.length + ' glycosylation sites. Submit record to save changes');
      sub.protein.glycosylation.NGlycosylationSites = gsites;
      setJson(sub);
    }

    // gsites.$$displayString = angular.element(document.body).injector().get('siteList').siteString(gsites);

  }

}



interface DisplaySite {
  type: string;
  subunit: number;
  residue: number;
}

interface TestSequence {
  subunitIndex?: number;
  subsections?: Array<any>;
  subgroups?: Array<any>;
  subunits?: Array<SequenceUnit>;
}

