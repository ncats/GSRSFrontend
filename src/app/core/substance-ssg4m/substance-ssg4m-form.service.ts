import { Injectable, OnDestroy } from '@angular/core';
import {
  SubstanceDetail
} from '../substance/substance.model';
import { SubstanceName, SubstanceNameOrg,  SubstanceStructure,
  SubstanceMoiety,
  Subunit,
  Link,
  DisulfideLink,
  Glycosylation,
  Site,
  StructuralModification,
  Sugar,
  Linkage,
  NucleicAcid,
  StructurallyDiverse, DisplayStructure, Monomer, PolymerClassification} from '../substance/substance.model';
import {
  SequenceUnit,
  SubstanceFormDefinition,
  SubstanceFormResults, SubunitSequence, ValidationResults, ValidationMessage
} from '../substance-form/substance-form.model';
import { Observable, Subject, ReplaySubject, Subscription } from 'rxjs';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { StructureService } from '@gsrs-core/structure';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class SubstanceSsg4mService implements OnDestroy {
  private privateSubstance: SubstanceDetail;
  private substanceStateHash?: number;
  private substanceEmitter: ReplaySubject<SubstanceDetail>;
  private substanceDisulfideLinksEmitter = new ReplaySubject<Array<DisulfideLink>>();
  private substanceGlycosylationEmitter = new ReplaySubject<Glycosylation>();
  private substanceLinksEmitter = new ReplaySubject<Array<Linkage>>();
  private substanceNamesEmitter = new ReplaySubject<Array<SubstanceName>>();
  private substanceOtherLinksEmitter = new ReplaySubject<Array<Link>>();
  private substanceStructuralModificationsEmitter = new ReplaySubject<Array<StructuralModification>>();
  private substanceCysteineEmitter = new ReplaySubject<Array<Site>>();
  private substanceFormActionEmitter = new ReplaySubject<'load' | 'unload'>();

  private definitionEmitter = new Subject<SubstanceFormDefinition>();
  private subClass: string;
  private substanceSubunitsEmitter = new Subject<Array<Subunit>>();
  private substanceSugarsEmitter = new Subject<Array<Sugar>>();
  private substanceNucleicAcidEmitter = new Subject<NucleicAcid>();
  private allSitesArr: Array<DisplaySite>;
  private allSitesEmitter = new Subject<Array<DisplaySite>>();
  private displaySequences: Array<SubunitSequence>;
  private displaySequencesEmitter = new Subject<Array<SubunitSequence>>();
  private substanceChangeReasonEmitter = new Subject<string>();
  private nameResolver = new Subject<string>();
  resolvedMol = this.nameResolver.asObservable();
  private _bypassUpdateCheck = false;
  private method?: string;

  constructor(
    private substanceService: SubstanceService,
    public utilsService: UtilsService,
    private structureService: StructureService
  ) {
    this.substanceEmitter = new ReplaySubject<SubstanceDetail>();
  }

  ngOnDestroy() {
    this.unloadSubstance();
  }

  /*
  loadSubstance(substanceClass: string = 'chemical', substance?: SubstanceDetail, method?: string, mergeConcept?: boolean): Observable<void> {

    if (method) {
      this.method = method;
    } else {
      this.method = null;
    }
    if (mergeConcept) {
      this.privateSubstance = substance;
      this.substanceEmitter.next(substance);
      this.namesUpdated();
    }
    return new Observable(observer => {
      if (substance != null) {
        this.privateSubstance = substance;
        substanceClass = this.privateSubstance.substanceClass;
      } else {
        // the second case happens in the forms sometimes but really shouldn't
        if (substanceClass === 'chemical' || substanceClass === 'structure') {
          this.privateSubstance = {
            substanceClass: 'chemical',
            references: [],
            names: [],
            structure: {
              molfile: '\n\n\n  0  0  0  0  0  0            999 V2000\nM  END'
            },
            codes: [],
            relationships: [],
            properties: []
          };
        } else if (substanceClass === 'protein') {
          this.privateSubstance = {
            substanceClass: 'protein',
            references: [],
            names: [],
            protein: { proteinType: '' },
            codes: [],
            relationships: [],
            properties: []
          };
        } else if (substanceClass === 'nucleicAcid') {
          this.privateSubstance = {
            substanceClass: 'nucleicAcid',
            references: [],
            names: [],
            nucleicAcid: {},
            codes: [],
            relationships: [],
            properties: []
          };
        } else if (substanceClass === 'mixture') {
          this.privateSubstance = {
            substanceClass: 'mixture',
            references: [],
            names: [],
            mixture: {},
            codes: [],
            relationships: [],
            properties: []
          };
        } else if (substanceClass === 'structurallyDiverse') {
          this.privateSubstance = {
            substanceClass: 'structurallyDiverse',
            references: [],
            names: [],
            structurallyDiverse: {
              part: ['whole'],
              $$diverseType: 'whole'
            },
            codes: [],
            relationships: [],
            properties: []
          };
        } else if (substanceClass === 'specifiedSubstance' || (substanceClass === 'specifiedSubstanceG1')) {
          this.privateSubstance = {
            substanceClass: 'specifiedSubstanceG1',
            references: [],
            names: [],
            specifiedSubstance: {
              constituents: [],
              references: []
            },
            codes: [],
            relationships: [],
            properties: []
          };
        } else if (substanceClass === 'specifiedSubstanceG3') {
          this.privateSubstance = {
            substanceClass: substanceClass,
            references: [],
            names: [],
            specifiedSubstanceG3: {
              parentSubstance: {},
              definition: {references: []},
              grade: {references: []}
            },
            codes: [],
            properties: []
          };
        } else if (substanceClass === 'polymer') {
          this.privateSubstance = {
            substanceClass: substanceClass,
            references: [],
            names: [],
            polymer: {
              idealizedStructure: {},
              monomers: [],
            },
            codes: [],
            moieties: [],
            relationships: [],
            properties: []
          };
        } else {
          this.privateSubstance = {
            substanceClass: substanceClass,
            references: [],
            names: [],
            codes: []
          };
        }
        // default values

        // TP: default to protected for root level record.
        this.privateSubstance.access=["protected"];
        this.privateSubstance.definitionLevel = "COMPLETE";
        this.privateSubstance.definitionType = "PRIMARY";
      }

      this.subClass = this.privateSubstance.substanceClass;

      // Only these two substance classes differ from
      // the name of their JSON defintional element
      // That's why they are used as exceptions

      if (this.subClass === 'chemical') {
        this.subClass = 'structure';
      } else if (this.subClass === 'specifiedSubstanceG1') {
        this.subClass = 'specifiedSubstance';
      }

      if (this.privateSubstance[this.subClass] == null) {
        this.privateSubstance[this.subClass] = {};
      }
      this.initForm();
      this.substanceEmitter.next(this.privateSubstance);
      observer.next();
      observer.complete();
    });
  }
  */

  get substanceFormAction(): Observable<'load' | 'unload'> {
    return this.substanceFormActionEmitter.asObservable();
  }

  initForm(): void {
    this.substanceFormActionEmitter.next('load');
  }

  get substance(): Observable<SubstanceDetail> {
    return this.substanceEmitter.asObservable();
  }

  resetState(): void {
    const substanceString = JSON.stringify(this.privateSubstance);
    this.substanceStateHash = this.utilsService.hashCode(substanceString);
  }

  unloadSubstance(): void {
    // this.privateSubstance = null;
    this.allSitesArr = null;
    this.displaySequences = null;
    this.substanceEmitter.complete();
    this.substanceDisulfideLinksEmitter.complete();
    this.substanceGlycosylationEmitter.complete();
    this.substanceLinksEmitter.complete();
    this.substanceNamesEmitter.complete();
    this.substanceOtherLinksEmitter.complete();
    this.substanceStructuralModificationsEmitter.complete();
    this.substanceCysteineEmitter.complete();
    this.substanceEmitter = new ReplaySubject<SubstanceDetail>();
    this.substanceDisulfideLinksEmitter = new ReplaySubject<Array<DisulfideLink>>();
    this.substanceGlycosylationEmitter = new ReplaySubject<Glycosylation>();
    this.substanceLinksEmitter = new ReplaySubject<Array<Linkage>>();
    this.substanceLinksEmitter = new ReplaySubject<Array<SubstanceName>>();
    this.substanceOtherLinksEmitter = new ReplaySubject<Array<Link>>();
    this.substanceStructuralModificationsEmitter = new ReplaySubject<Array<StructuralModification>>();
    this.substanceCysteineEmitter = new ReplaySubject<Array<Site>>();
    this.substanceFormActionEmitter.next('unload');
  }

  ready(): Observable<void> {
    return new Observable(observer => {
      this.substanceEmitter.pipe(take(1)).subscribe(substance => {
        observer.next();
        observer.complete();
      });
    });
  }

  /*
  setDefinitionFromDefRef(access: any) {

    if (this.privateSubstance.structurallyDiverse) {
      this.privateSubstance.structurallyDiverse.access = access;
    } else if (this.privateSubstance.protein) {
      this.privateSubstance.protein.access = access;
    } else if (this.privateSubstance.structure) {
      this.privateSubstance.structure.access = access;
    } else if (this.privateSubstance.mixture) {
      this.privateSubstance.mixture.access = access;
    } else if (this.privateSubstance.polymer) {
      this.privateSubstance.polymer.access = access;
    } else if (this.privateSubstance.nucleicAcid) {
      this.privateSubstance.nucleicAcid.access = access;
    } else if (this.privateSubstance.specifiedSubstance) {
      this.privateSubstance.specifiedSubstance.access = access;
    } else {
    }
    this.substanceEmitter.next(this.privateSubstance);
  }

  getDefinitionForDefRef() {

    if (this.privateSubstance.structurallyDiverse) {
     return this.privateSubstance.structurallyDiverse.access;
    } else if (this.privateSubstance.protein) {
      return this.privateSubstance.protein.access;
    } else if (this.privateSubstance.structure) {
      return this.privateSubstance.structure.access;
    } else if (this.privateSubstance.mixture) {
      return this.privateSubstance.mixture.access;
    } else if (this.privateSubstance.polymer) {
      return this.privateSubstance.polymer.access;
    } else if (this.privateSubstance.nucleicAcid) {
      return  this.privateSubstance.nucleicAcid.access;
    } else if (this.privateSubstance.specifiedSubstance) {
      return  this.privateSubstance.specifiedSubstance.access;
    } else {
    }
    this.definitionEmitter.next(this.getDefinition());
  }

  changeApproval() {
    const apid = prompt('Enter new ApprovalID:');

    if (apid) {
      const old = this.privateSubstance.approvalID;
      this.privateSubstance.approvalID = apid;
      alert('Approval ID changed from"' + old + '" to "' + apid + '". Submit changes to save');
      this.definitionEmitter.next(this.getDefinition());
    }
  }

  switchType(substance: SubstanceDetail, newClass: string) {
    const fieldGetter = {
      'protein': ['protein', 'modifications', 'properties'],
      'chemical': ['structure', 'moieties', 'modifications', 'properties'],
      'structurallyDiverse': ['structurallyDiverse', 'modifications', 'properties'],
      'polymer': ['polymer', 'modifications', 'properties'],
      'nucleicAcid': ['nucleicAcid', 'modifications', 'properties'],
      'mixture': ['mixture', 'modifications', 'properties'],
      'specifiedSubstanceG1': []
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
      substance.protein = { proteinType: '' };

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
      substance.specifiedSubstance = {
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
    if (this.privateSubstance.structurallyDiverse) {
      this.setPrivate(this.privateSubstance.structurallyDiverse);
    } else if (this.privateSubstance.protein) {
      this.setPrivate(this.privateSubstance.protein);
    } else if (this.privateSubstance.structure) {
      this.setPrivate(this.privateSubstance.structure);
    } else if (this.privateSubstance.mixture) {
      this.setPrivate(this.privateSubstance.mixture);
    } else if (this.privateSubstance.polymer) {
      this.setPrivate(this.privateSubstance.polymer);
    } else if (this.privateSubstance.nucleicAcid) {
      this.setPrivate(this.privateSubstance.nucleicAcid);
    } else if (this.privateSubstance.specifiedSubstance) {
      this.setPrivate(this.privateSubstance.specifiedSubstance);
    } else {
    }
  }
  setPrivate(e) {
    e.access = ['protected'];
    alert('Substance definition now set to protected, please submit to save change');
  }


  setDefinitionPublic() {

    if (this.privateSubstance.structurallyDiverse) {
      this.setPublic(this.privateSubstance.structurallyDiverse);
    } else if (this.privateSubstance.protein) {
      this.setPublic(this.privateSubstance.protein);
    } else if (this.privateSubstance.structure) {
      this.setPublic(this.privateSubstance.structure);
    } else if (this.privateSubstance.mixture) {
      this.setPublic(this.privateSubstance.mixture);
    } else if (this.privateSubstance.polymer) {
      this.setPublic(this.privateSubstance.polymer);
    } else if (this.privateSubstance.nucleicAcid) {
      this.setPublic(this.privateSubstance.nucleicAcid);
    } else if (this.privateSubstance.specifiedSubstance) {
      this.setPublic(this.privateSubstance.specifiedSubstance);
    } else {
    }
  }

  conceptNonApproved() {
    if (this.privateSubstance.substanceClass === 'concept') {
      this.privateSubstance.status = 'non-approved';
      alert('Concept status set to "non approved", please submit to save changes');
    } else {
      alert('Can only change status of concept records');
    }
  }

  unapproveRecord() {
    const old = this.privateSubstance.approvalID;
    this.privateSubstance.approvalID = null;
    this.privateSubstance.status = null;
    this.privateSubstance.approved = null;
    this.privateSubstance.approvedBy = null;
    alert('Removed approvalID \'' + old + '\'. Submit record to save.');
  }

  setPublic(e) {
    e.access = [];
    alert('Substance definition set to be PUBLIC, please submit to save change');
  }

  get isSubstanceUpdated(): boolean {
    const substanceString = JSON.stringify(this.privateSubstance);
    if (this._bypassUpdateCheck) {
      this._bypassUpdateCheck = false;
      return false;
    } else {
      return this.substanceStateHash !== this.utilsService.hashCode(substanceString);
    }
  }

  bypassUpdateCheck(): void {
    this._bypassUpdateCheck = true;
  }

  // Definition Start

  get definition(): Observable<SubstanceFormDefinition> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        const definition = this.getDefinition();
        observer.next(definition);
        // eslint-disable-next-line @typescript-eslint/no-shadow
        this.definitionEmitter.subscribe(definition => {
          observer.next(definition);
        });
      });
    });
  }

  updateDefinition(definition: SubstanceFormDefinition): void {
    this.privateSubstance.definitionLevel = definition.definitionLevel;
    this.privateSubstance.deprecated = definition.deprecated;
    this.privateSubstance.access = definition.access;
    this.privateSubstance.created = definition.created;
    this.privateSubstance.createdBy = definition.createdBy;
    this.privateSubstance.lastEdited = definition.lastEdited;
    this.privateSubstance.lastEditedBy = definition.lastEditedBy;
    if (definition.status) {
      this.privateSubstance.status = definition.status;
    }
    if (definition.approvalID) {
      this.privateSubstance.approvalID = definition.approvalID;
    }
    if (this.privateSubstance[definition.substanceClass]) {
      this.privateSubstance[definition.substanceClass].references = definition.references;
    } else {
      this.privateSubstance[definition.substanceClass] = {
        references: definition.references
      };
    }

    if (this.privateSubstance.definitionType !== definition.definitionType) {
      if (definition.definitionType === 'ALTERNATIVE') {
        this.privateSubstance.names = [];
        this.privateSubstance.codes = [];
        this.substanceNamesEmitter.next(this.privateSubstance.names);
      }
    }
    this.privateSubstance.definitionType = definition.definitionType;
    this.definitionEmitter.next(this.getDefinition());
  }
  */

  getJson() {
    return this.privateSubstance;
  }

  getUuid(): string {
    return this.privateSubstance.uuid;
  }

  getClass(): string {
    return this.privateSubstance.substanceClass;
  }

  changeStatus(status: string): void {
    this.privateSubstance.status = status;
    alert('Status changed to ' + status);
  }
/*
  private getDefinition(): SubstanceFormDefinition {

    if (!this.privateSubstance[this.subClass]) {
      this.privateSubstance[this.subClass] = {
        references: []
      };
      const substanceString = JSON.stringify(this.privateSubstance);
      this.substanceStateHash = this.utilsService.hashCode(substanceString);
    }

    if (!this.privateSubstance[this.subClass].references) {
      this.privateSubstance[this.subClass].references = [];
      const substanceString = JSON.stringify(this.privateSubstance);
      this.substanceStateHash = this.utilsService.hashCode(substanceString);
    }

    if (!this.privateSubstance.tags) {
      this.privateSubstance.tags = [];
      const substanceString = JSON.stringify(this.privateSubstance);
      this.substanceStateHash = this.utilsService.hashCode(substanceString);
    }


    const definition: SubstanceFormDefinition = {
      uuid: this.privateSubstance[this.subClass].uuid || this.privateSubstance[this.subClass].id,
      substanceClass: this.subClass,
      definitionType: this.privateSubstance.definitionType,
      definitionLevel: this.privateSubstance.definitionLevel,
      deprecated: this.privateSubstance.deprecated,
      references: this.privateSubstance[this.subClass].references,
      access: this.privateSubstance.access,
      relationships: this.privateSubstance.relationships,
      created: this.privateSubstance.created,
      createdBy: this.privateSubstance.createdBy,
      lastEdited: this.privateSubstance.lastEdited,
      lastEditedBy: this.privateSubstance.lastEditedBy,
      _name: this.privateSubstance._name,
      tags: this.privateSubstance.tags
    };
    if (this.privateSubstance.status) {
      definition.status = this.privateSubstance.status;
    }
    if (this.privateSubstance.approvalID) {
      definition.approvalID = this.privateSubstance.approvalID;
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


   if (this.privateSubstance.structure) {

      if ( this.privateSubstance.structure.properties) {
        delete this.privateSubstance.structure.properties;
      }
      if ( this.privateSubstance.structure.links) {
        delete this.privateSubstance.structure.links;
      }
    }
    if (this.privateSubstance.polymer && this.privateSubstance.polymer.displayStructure) {

      if ( this.privateSubstance.polymer.displayStructure.properties) {
        delete this.privateSubstance.polymer.displayStructure.properties;
      }
      if ( this.privateSubstance.polymer.displayStructure.links) {
        delete this.privateSubstance.polymer.displayStructure.links;
      }
    }
    if (this.privateSubstance.polymer && this.privateSubstance.polymer.idealizedStructure) {

      if ( this.privateSubstance.polymer.idealizedStructure.properties) {
        delete this.privateSubstance.polymer.idealizedStructure.properties;
      }
      if ( this.privateSubstance.polymer.idealizedStructure.links) {
        delete this.privateSubstance.polymer.idealizedStructure.links;
      }
    }

    if (this.privateSubstance.moieties) {
      this.privateSubstance.moieties.forEach(moiety => {
          if (moiety.properties) {
            delete moiety.properties;
          }
          if (moiety.links) {
            delete moiety.links;
          }
      });
    }

    if (this.privateSubstance.protein && this.privateSubstance.protein.disulfideLinks
       && this.privateSubstance.protein.disulfideLinks.length > 0) {
          for ( let i = this.privateSubstance.protein.disulfideLinks.length; i >= 0;  i--) {
            if (this.privateSubstance.protein.disulfideLinks[i] && this.privateSubstance.protein.disulfideLinks[i].sites &&
              this.privateSubstance.protein.disulfideLinks[i].sites[0] && this.privateSubstance.protein.disulfideLinks[i].sites[1] &&
              Object.keys(this.privateSubstance.protein.disulfideLinks[i].sites[0]).length === 0 &&
                Object.keys(this.privateSubstance.protein.disulfideLinks[i].sites[1]).length === 0 ) {
                  this.privateSubstance.protein.disulfideLinks.splice(i, 1);
          }
        }
       }
    // end view=internal changes

    let substanceString = JSON.stringify(this.privateSubstance);
    let substanceCopy: SubstanceDetail = JSON.parse(substanceString);

    const response = this.cleanObject(substanceCopy);
    const deletedUuids = response.deletedUuids;

    if (deletedUuids.length > 0) {
      substanceString = JSON.stringify(substanceCopy);

      deletedUuids.forEach(uuid => {
        substanceString = substanceString.replace(new RegExp(`"${uuid}"`, 'g'), '');
      });
      substanceString = substanceString.replace(/,[,]+/g, ',');
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

  getMethod(): string {
    return this.method;
  }

  structureDuplicateCheck(): any {
    return new Observable(observer => {
      this.structureService.duplicateCheck(this.privateSubstance).subscribe(response => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  getUNII() {
    return this.privateSubstance._approvalIDDisplay;
  }

  approveSubstance(): Observable<any> {
    return new Observable(observer => {
      const results: SubstanceFormResults = {
        isSuccessfull: true
      };
      this.substanceService.approveSubstance(this.privateSubstance.uuid).subscribe(substance => {
        this.privateSubstance = substance;
        results.uuid = substance.uuid;
        this.definitionEmitter.next(this.getDefinition());
        if (this.privateSubstance.substanceClass === 'protein') {
          this.substanceSubunitsEmitter.next(this.privateSubstance.protein.subunits);
        } else if (this.privateSubstance.substanceClass === 'nucleicAcid') {
          this.substanceSugarsEmitter.next(this.privateSubstance.nucleicAcid.sugars);
          this.substanceSubunitsEmitter.next(this.privateSubstance.nucleicAcid.subunits);
        } else if (this.privateSubstance.substanceClass === 'mixture') {
          this.substanceSubunitsEmitter.next(this.privateSubstance.mixture.components);
        }
        this.substanceChangeReasonEmitter.next(this.privateSubstance.changeReason);
        this.resetState();
        this.substanceEmitter.next(this.privateSubstance);
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

  saveSubstance(): Observable<SubstanceFormResults> {
    return new Observable(observer => {
      const results: SubstanceFormResults = {
        isSuccessfull: true
      };
      if (this.privateSubstance.structure != null && !this.privateSubstance.structure.uuid) {
        this.privateSubstance.structure.id = this.utilsService.newUUID();
        this.privateSubstance.structure.uuid = this.privateSubstance.structure.id;
      }
      if (this.privateSubstance.moieties != null && this.privateSubstance.moieties.length) {
        this.privateSubstance.moieties.forEach(moiety => {
          if (!moiety.uuid) {
            moiety.id = this.utilsService.newUUID();
            moiety.uuid = moiety.id;
          }
        });
      }

      const substanceCopy = this.cleanSubstance();
      this.substanceService.saveSubstance(substanceCopy, this.method).subscribe(substance => {
        this.privateSubstance = substance;
        results.uuid = substance.uuid;
        this.definitionEmitter.next(this.getDefinition());
        if (this.privateSubstance.substanceClass === 'protein') {
          this.substanceSubunitsEmitter.next(this.privateSubstance.protein.subunits);
        } else if (this.privateSubstance.substanceClass === 'nucleicAcid') {
          this.substanceSugarsEmitter.next(this.privateSubstance.nucleicAcid.sugars);
          this.substanceSubunitsEmitter.next(this.privateSubstance.nucleicAcid.subunits);
        } else if (this.privateSubstance.substanceClass === 'mixture') {
          this.substanceSubunitsEmitter.next(this.privateSubstance.mixture.components);
        }
        this.substanceChangeReasonEmitter.next(this.privateSubstance.changeReason);
        this.substanceService.getSubstanceDetails(results.uuid).subscribe(resp => {
          this.privateSubstance = resp;
          this.resetState();
          this.substanceEmitter.next(this.privateSubstance);
          observer.next(results);
          observer.complete();
        }, error => {
          observer.next(results);
          observer.complete();
        });
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

  importSubstance(substance, method?: string) {
    this.privateSubstance = substance;
    if (!method || method !== 'update') {
      this.method = 'import';
    } else {
      this.method = null;
    }
        this.definitionEmitter.next(this.getDefinition());
        if (this.privateSubstance.substanceClass === 'protein') {
          this.substanceSubunitsEmitter.next(this.privateSubstance.protein.subunits);
        } else if (this.privateSubstance.substanceClass === 'nucleicAcid') {
          this.substanceSugarsEmitter.next(this.privateSubstance.nucleicAcid.sugars);
          this.substanceSubunitsEmitter.next(this.privateSubstance.nucleicAcid.subunits);
        } else if (this.privateSubstance.substanceClass === 'mixture') {
          this.substanceSubunitsEmitter.next(this.privateSubstance.mixture.components);
        }
        this.substanceChangeReasonEmitter.next(this.privateSubstance.changeReason);
        this.resetState();
        this.substanceEmitter.next(this.privateSubstance);
  }

  stringToSites(slist: string): Array<Site> {
    slist = slist.replace(/ /g, '');
    if (!slist) {
      return [];
    }
    const toks = slist.split(';');
    const sites = [];
    // eslint-disable-next-line guard-for-in
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
    if (data.siteType === 'CGlycosylation') {
      this.privateSubstance.protein.glycosylation.CGlycosylationSites =
        this.privateSubstance.protein.glycosylation.CGlycosylationSites.concat(data.links);
      this.emitGlycosylationUpdate();
    } else if (data.siteType === 'NGlycosylation') {
      this.privateSubstance.protein.glycosylation.NGlycosylationSites =
        this.privateSubstance.protein.glycosylation.NGlycosylationSites.concat(data.links);
      this.emitGlycosylationUpdate();
    } else if (data.siteType === 'OGlycosylation') {
      this.privateSubstance.protein.glycosylation.OGlycosylationSites =
        this.privateSubstance.protein.glycosylation.OGlycosylationSites.concat(data.links);
      this.emitGlycosylationUpdate();
    } else if (data.siteType === 'disulfide') {
      const newLink: Link = { sites: data.links };
      this.privateSubstance.protein.disulfideLinks.unshift(newLink);
      this.emitDisulfideLinkUpdate();

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
    if (this.privateSubstance.substanceClass === 'protein') {
      subunits = this.privateSubstance.protein.subunits;
    } else {
      subunits = this.privateSubstance.nucleicAcid.subunits;
    }
    const t0 = performance.now();
    const subunitSequences = [];
    let subunitIndex = 1;
    subunits.forEach(subunit => {
      const subsections = [];
      let currentSections = [];
      if (subunit.sequence != null && subunit.sequence.length > 0) {
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
      }
      const thisTest: TestSequence = {
        subunitIndex: subunitIndex,
        subunits: [],
        subsections: subsections,
        subgroups: currentSections
      };
      let index = 0;
      const indexEnd = subunit.sequence && subunit.sequence.length || 0;
      while (index < indexEnd) {
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

  disulfideLinks() {

    const KNOWN_DISULFIDE_PATTERNS = {};
    ('IGG4	0-1,11-12,13-31,14-15,18-19,2-26,20-21,22-23,24-25,27-28,29-30,3-4,5-16,6-17,7-8,9-10\n' +
      'IGG2	0-1,11-12,13-14,15-35,16-17,2-30,22-23,24-25,26-27,28-29,3-4,31-32,33-34,5-18,6-19,7-20,8-21,9-10\n' +
      'IGG1	0-1,11-12,13-14,15-31,18-19,2-3,20-21,22-23,24-25,27-28,29-30,4-26,5-16,6-17,7-8,9-10').split('\n').map(function (s) {
        const tup = s.split('\t');

        const list = _.chain(tup[1].split(',')).map(function (t) {
          return _.map(t.split('-'), function (temp) {
            return +temp - 0;
          });
        }).value();

        KNOWN_DISULFIDE_PATTERNS[tup[0]] = list;
      });
    const proteinSubstance = this.privateSubstance;
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
        ng = _.chain(s).map(function (s1) {
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

    this.privateSubstance.protein.disulfideLinks = newDS;
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

    const sub = this.privateSubstance;
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
*/
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

