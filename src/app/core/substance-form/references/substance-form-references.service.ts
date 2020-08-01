import { Injectable } from '@angular/core';
import { domainKeys, domainDisplayKeys } from './domain-references/domain-keys.constant';
import { DomainsWithReferences } from './domain-references/domain.references.model';
import { SubstanceReference } from '@gsrs-core/substance/substance.model';
import { ReplaySubject, Observable } from 'rxjs';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { UtilsService } from '@gsrs-core/utils';

@Injectable()
export class SubstanceFormReferencesService extends SubstanceFormServiceBase<Array<SubstanceReference>> {
  private privateDomainsWithReferences: DomainsWithReferences;
  private domainsWithReferencesEmitter = new ReplaySubject<DomainsWithReferences>();

  constructor(
    public substanceFormService: SubstanceFormService,
    private utilsService: UtilsService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.privateDomainsWithReferences = null;
      this.substance = substance;
      if (this.substance.references == null) {
        this.substance.references = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.references);
      this.domainsWithReferencesEmitter.next(this.getDomainReferences());
    });
    this.subscriptions.push(subscription);
  }

  unloadSubstance() {
    super.unloadSubstance();
    this.domainsWithReferencesEmitter.complete();
    this.domainsWithReferencesEmitter = new ReplaySubject<DomainsWithReferences>();
  }

  get substanceReferences(): Observable<Array<SubstanceReference>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceReference(reference: SubstanceReference): SubstanceReference {
    reference.uuid = this.utilsService.newUUID();
    if (this.substance.references == null) {
      this.substance.references = [];
    }
    this.substance.references.unshift(reference);
    this.propertyEmitter.next(this.substance.references);
    return reference;
  }

  get domainsWithReferences(): Observable<DomainsWithReferences> {
    return this.domainsWithReferencesEmitter.asObservable();
  }

  getDomainReferences(): DomainsWithReferences {
    if (this.privateDomainsWithReferences == null) {
      let subClass = this.substance.substanceClass;
      if (this.substance.substanceClass === 'chemical') {
        subClass = 'structure';
      } else if (this.substance.substanceClass === 'specifiedSubstanceG1') {
        subClass = 'specifiedSubstance';
      }

      const trimmedDomain = {
        uuid: this.substance[subClass]['uuid'],
        references: this.substance[subClass]['references'],
      };
      this.privateDomainsWithReferences = {
        definition: {
          subClass: this.substance.substanceClass,
          domain: trimmedDomain
        }
      };
      if (subClass === 'specifiedSubstance') {
        this.privateDomainsWithReferences = {
          definition: {
            subClass: this.substance.substanceClass,
            domain: trimmedDomain
          }
        };
      }

   /* Old method of generating list, sends unnecessary information, but is known to work
   this.privateDomainsWithReferences = {
          definition: {
            subClass: this.substance.substanceClass,
            domain: this.substance[subClass]
          }
        };
    domainKeys.forEach(key => {
        this.privateDomainsWithReferences2[key] = {
          listDisplay: key,
          displayKey: domainDisplayKeys[key],
          domains: this.substance[key]
        };
      });
      if (subClass === 'specifiedSubstance') {
        const key = 'specifiedSubstance.constituents';
        this.privateDomainsWithReferences2[key] = {
          listDisplay: key,
          displayKey: domainDisplayKeys[key],
          domains: this.substance[key]
        };
      }
      */
      domainKeys.forEach(key => {
        const temp = [];
        let keyFix = key;
        if (key === 'constituents' && subClass === 'specifiedSubstance') {
          keyFix = 'specifiedSubstance["constituents"]';
          if (this.substance.specifiedSubstance && this.substance.specifiedSubstance.constituents) {
            this.substance.specifiedSubstance.constituents.forEach( object => {
              let toAdd = {
                uuid: object.uuid,
                display: '',
                references: object.references
              };
              if (object && object.substance) {
                  toAdd.display =  object.substance.name;
              temp.push(toAdd);
              }
        });
      }
    } else {
        if (this.substance[keyFix]) {
        this.substance[keyFix].forEach( object => {
          let toAdd = {
            uuid: object.uuid,
            display: '',
            references: object.references
          };
          if (object) {
            if (domainDisplayKeys[key].indexOf('.') > 0) {
              const split = domainDisplayKeys[key].split('.');

              toAdd[domainDisplayKeys[key]] = object[split[0]][split[1]];
              toAdd.display =  object[split[0]][split[1]];

            } else {
              toAdd[domainDisplayKeys[key]] = object[domainDisplayKeys[key]];
              toAdd.display = object[domainDisplayKeys[key]];
            }
          temp.push(toAdd);
          }
        });
        }
      }
      this.privateDomainsWithReferences[key] = {
        listDisplay: key,
        displayKey: domainDisplayKeys[key],
        domains: temp
      };
        });
    console.log(this.privateDomainsWithReferences);
      }
    return this.privateDomainsWithReferences;
  }

  deleteSubstanceReference(reference: SubstanceReference): void {
    const subRefIndex = this.substance.references.findIndex(subReference => reference.$$deletedCode === subReference.$$deletedCode);
    if (subRefIndex > -1) {
      this.substance.references.splice(subRefIndex, 1);
      this.propertyEmitter.next(this.substance.references);
    }
  }

  emitReferencesUpdate(): void {
    this.propertyEmitter.next(this.substance.references);
  }

}
