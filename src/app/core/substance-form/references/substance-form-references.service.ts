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
      this.privateDomainsWithReferences = {
        definition: {
          subClass: this.substance.substanceClass,
          domain: this.substance[subClass]
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
      this.propertyEmitter.next(this.substance.references);
    }
  }

  emitReferencesUpdate(): void {
    this.propertyEmitter.next(this.substance.references);
  }

}
