import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams, HttpClientJsonpModule, HttpParameterCodec } from '@angular/common/http';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config/config.service';
import { Ssg4mSyntheticPathway } from './model/substance-ssg4m.model';
import {
  SubstanceDetail
} from '../substance/substance.model';
import {
  SubstanceName, SubstanceNameOrg, SubstanceStructure,
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
  StructurallyDiverse, DisplayStructure, Monomer, PolymerClassification
} from '../substance/substance.model';
import {
  SequenceUnit,
  SubstanceFormDefinition,
  SubstanceFormResults, SubunitSequence, ValidationResults, ValidationMessage
} from '../substance-form/substance-form.model';
import { Observable, Subject, ReplaySubject, Subscription } from 'rxjs';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { StructureService } from '@gsrs-core/structure';

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
  private displaySequences: Array<SubunitSequence>;
  private displaySequencesEmitter = new Subject<Array<SubunitSequence>>();
  private substanceChangeReasonEmitter = new Subject<string>();
  private nameResolver = new Subject<string>();
  resolvedMol = this.nameResolver.asObservable();
  private _bypassUpdateCheck = false;
  private method?: string;

  apiBaseUrlSsg4mEntityUrl = this.configService.configData.apiSSG4mBaseUrl + 'api/v1/ssg4m' + '/';

  constructor(
    private substanceService: SubstanceService,
    public utilsService: UtilsService,
    private structureService: StructureService,
    public http: HttpClient,
    public configService: ConfigService
  ) {
    this.substanceEmitter = new ReplaySubject<SubstanceDetail>();
  }

  ngOnDestroy() {
    this.unloadSubstance();
  }

  loadSubstance(substanceClass: string = 'chemical', substance?: SubstanceDetail, method?: string, mergeConcept?: boolean): Observable<void> {
    if (method) {
      this.method = method;
    } else {
      this.method = null;
    }
    if (mergeConcept) {
      this.privateSubstance = substance;
      this.substanceEmitter.next(substance);
      //  this.namesUpdated();
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
              definition: { references: [] },
              grade: { references: [] }
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
        } else if (substanceClass === 'specifiedSubstanceG4m') {
          this.privateSubstance = {
            substanceClass: substanceClass,
            // references: [],
            specifiedSubstanceG4m: {
              parentSubstance: {},
              process: []
            },
            // codes: [],
            //  properties: []
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
        // this.privateSubstance.access = ["protected"];
        // this.privateSubstance.definitionLevel = "COMPLETE";
        // this.privateSubstance.definitionType = "PRIMARY";
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

  saveSsg4m(ssg4m: Ssg4mSyntheticPathway, type?: string): Observable<Ssg4mSyntheticPathway> {
    // const url = `${this.configService.configData.apiBaseUrl}api/v1/ssg4m`;
    const url = this.apiBaseUrlSsg4mEntityUrl;
    let method = ssg4m.synthPathwaySkey ? 'PUT' : 'POST';
    const options = {
      body: ssg4m
    };
    return this.http.request(method, url, options);
  }

  validateSsg4m(ssg4m: Ssg4mSyntheticPathway): Observable<ValidationResults> {
    // const url = `${this.configService.configData.apiBaseUrl}api/v1/ssg4m/@validate`;
    const url = this.apiBaseUrlSsg4mEntityUrl + '@validate';
    return this.http.post(url, ssg4m);
  }

  cleanSubstance(): SubstanceDetail {
    if (this.privateSubstance.structurallyDiverse) {
      if (this.privateSubstance.structurallyDiverse.$$diverseType) {
        delete this.privateSubstance.structurallyDiverse.$$diverseType;
      }
      if (this.privateSubstance.structurallyDiverse.$$storedPart) {
        delete this.privateSubstance.structurallyDiverse.$$storedPart;
      }

      const toclean = ['organismFamily', 'organismGenus', 'organismSpecies', 'organismAuthor', 'infraSpecificName', 'infraSpecificType', 'fractionMaterialType', 'fractionName', 'developmentalStage'];
      toclean.forEach(field => {
        if (this.privateSubstance.structurallyDiverse[field] && this.privateSubstance.structurallyDiverse[field] !== null &&
          this.privateSubstance.structurallyDiverse[field] !== '') {
          this.privateSubstance.structurallyDiverse[field] = this.privateSubstance.structurallyDiverse[field].trim();
        }
      });
    }

    /*the substance API call for view=internal vs the usual 'view=full' adds some properties that should not be submitted
    and can cause errors upon submission. the view change was to allow the stdName property to be visible to the forms*/
    if (this.privateSubstance.structure) {

      if (this.privateSubstance.structure.properties) {
        delete this.privateSubstance.structure.properties;
      }
      if (this.privateSubstance.structure.links) {
        delete this.privateSubstance.structure.links;
      }
    }
    if (this.privateSubstance.polymer && this.privateSubstance.polymer.displayStructure) {

      if (this.privateSubstance.polymer.displayStructure.properties) {
        delete this.privateSubstance.polymer.displayStructure.properties;
      }
      if (this.privateSubstance.polymer.displayStructure.links) {
        delete this.privateSubstance.polymer.displayStructure.links;
      }
    }
    if (this.privateSubstance.polymer && this.privateSubstance.polymer.idealizedStructure) {

      if (this.privateSubstance.polymer.idealizedStructure.properties) {
        delete this.privateSubstance.polymer.idealizedStructure.properties;
      }
      if (this.privateSubstance.polymer.idealizedStructure.links) {
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
      for (let i = this.privateSubstance.protein.disulfideLinks.length; i >= 0; i--) {
        if (this.privateSubstance.protein.disulfideLinks[i] && this.privateSubstance.protein.disulfideLinks[i].sites &&
          this.privateSubstance.protein.disulfideLinks[i].sites[0] && this.privateSubstance.protein.disulfideLinks[i].sites[1] &&
          Object.keys(this.privateSubstance.protein.disulfideLinks[i].sites[0]).length === 0 &&
          Object.keys(this.privateSubstance.protein.disulfideLinks[i].sites[1]).length === 0) {
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

  getSsg4mDetails(id: string, version?: string): Observable<Ssg4mSyntheticPathway> {
    // const url = `${this.configService.configData.apiBaseUrl}api/v1/ssg4m/${id}`;
    const url = this.apiBaseUrlSsg4mEntityUrl + id;

    return this.http.get<Ssg4mSyntheticPathway>(url);
  }
}
