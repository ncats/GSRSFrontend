import { Injectable } from '@angular/core';
import {
  SubstanceDetail,
  SubstanceReference
} from '../substance/substance.model';
import {
  SubstanceFormDefinition,
  SubstanceFormResults
} from './substance-form.model';
import { Observable, Subject } from 'rxjs';
import { SubstanceService } from '../substance/substance.service';
import { referencesDomains } from './domain-references/domains.constant';
import { DomainReferences } from './domain-references/domain-references';

@Injectable({
  providedIn: 'root'
})
export class SubstanceFormService {
  private substance: SubstanceDetail;
  private substanceEmitter = new Subject<SubstanceDetail>();
  private definitionEmitter = new Subject<SubstanceFormDefinition>();
  private substanceReferencesEmitter = new Subject<Array<SubstanceReference>>();
  private domainReferences: { [ uuid: string ]: DomainReferences } = {};
  private subClass: string;

  constructor(
    private substanceService: SubstanceService
  ) { }

  loadSubstance(substanceClass: string = 'chemical', substance?: SubstanceDetail): void {
    setTimeout(() => {
      if (substance != null) {
        this.substance = substance;
      } else {
        this.substance = {
          substanceClass: substanceClass
        };
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
    this.substance[definition.substanceClass].references = definition.references;
    this.substance.access = definition.access;
  }

  private getDefinition(): SubstanceFormDefinition {

    this.subClass = this.substance.substanceClass;

    if (this.subClass === 'chemical') {
      this.subClass = 'structure';
    } else if (this.subClass === 'specifiedSubstanceG1') {
      this.subClass = 'specifiedSubstance';
    }

    const definition: SubstanceFormDefinition = {
      uuid: this.substance[this.subClass].uuid,
      substanceClass: this.subClass,
      definitionType: this.substance.definitionType,
      definitionLevel: this.substance.definitionLevel,
      deprecated: this.substance.deprecated,
      references: this.substance[this.subClass].references,
      access: this.substance.access,
      relationships: this.substance.relationships
    };

    return definition;
  }

  get substanceReferences(): Observable<Array<SubstanceReference>> {
    setTimeout(() => {
      if (this.substance != null) {
        this.substanceReferencesEmitter.next(this.substance.references);
      } else {
        const subscription = this.substanceEmitter.subscribe(substance => {
          this.substanceReferencesEmitter.next(this.substance.references);
          subscription.unsubscribe();
        });
      }
    });
    return this.substanceReferencesEmitter.asObservable();
  }

  getDomainReferences(uuid: string): DomainReferences {
    if (this.domainReferences[uuid] != null) {
      return this.domainReferences[uuid];
    } else {
      let domain;

      if (this.substance[this.subClass].uuid === uuid) {
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

      this.domainReferences[uuid] = new DomainReferences(domain, this.substance.references);
      return this.domainReferences[uuid];
    }
  }

  getSubstanceValue(key: string): any {
    return this.substance[key];
  }

  saveSubstance(): Observable<SubstanceFormResults> {
    return new Observable(observer => {
      const results: SubstanceFormResults = {
        isSuccessfull: true
      };
      this.substanceService.saveSubstance(this.substance).subscribe(substance => {
        observer.next(results);
      }, error => {
        results.isSuccessfull = false;
        observer.error(results);
      });
    });
  }
}
