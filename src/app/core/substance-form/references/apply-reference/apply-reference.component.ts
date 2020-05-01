import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { domainKeys } from '../domain-references/domain-keys.constant';
import { DomainsWithReferences } from '../domain-references/domain.references.model';
import { SubstanceFormService } from '../../substance-form.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { SubstanceFormReferencesService } from '../substance-form-references.service';

@Component({
  selector: 'app-apply-reference',
  templateUrl: './apply-reference.component.html',
  styleUrls: ['./apply-reference.component.scss']
})
export class ApplyReferenceComponent implements OnInit, OnDestroy {
  domainKeys = domainKeys;
  domainsWithReferences: DomainsWithReferences;
  private privateSubReferenceUuid: string;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormReferencesService: SubstanceFormReferencesService
  ) { }

  ngOnInit() {
    const subscription = this.substanceFormReferencesService.domainsWithReferences.subscribe(domainsWithReferences => {
      this.domainsWithReferences = domainsWithReferences;
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set subReferenceUuid(uuid: string) {
    this.privateSubReferenceUuid = uuid;
  }

  applyToAll(): void {
    this.applyReference(this.domainsWithReferences.definition.domain);
    this.domainKeys.forEach(key => {
      this.domainsWithReferences[key].domains.forEach(domain => {
        this.applyReference(domain);
      });
    });
    this.substanceFormReferencesService.emitReferencesUpdate();
  }

  applyToAllWithoutRef(): void {
    if (this.domainsWithReferences.definition.domain.references == null
      || this.domainsWithReferences.definition.domain.references.length === 0) {
        this.applyReference(this.domainsWithReferences.definition.domain);
    }

    this.domainKeys.forEach(key => {
      if (this.domainsWithReferences[key] && this.domainsWithReferences[key].domains && this.domainsWithReferences[key].domains.length) {
        this.domainsWithReferences[key].domains.forEach(domain => {
          if (!domain.references || domain.references.length === 0) {
            this.applyReference(domain);
          }
        });
      }
    });
    this.substanceFormReferencesService.emitReferencesUpdate();
  }

  applyToAllDomain(domainKey: string): void {
    this.domainsWithReferences[domainKey].domains.forEach(domain => {
      this.applyReference(domain);
    });
    this.substanceFormReferencesService.emitReferencesUpdate();
  }

  applyToAllDomainWithoutRef(domainKey: string): void {
    if (this.domainsWithReferences[domainKey] && this.domainsWithReferences[domainKey].domains
      && this.domainsWithReferences[domainKey].domains.length) {
        this.domainsWithReferences[domainKey].domains.forEach(domain => {
          if (!domain.references || domain.references.length === 0) {
            this.applyReference(domain);
          }
        });
    }
    this.substanceFormReferencesService.emitReferencesUpdate();
  }

  updateAppliedOtion(event: MatCheckboxChange, domain: any): void {
    if (event.checked) {
      this.applyReference(domain);
    } else {
      this.removeReference(domain);
    }
  }

  applyReference(domain: any): void {
    if (!domain.references) {
      domain.references = [];
    }
    if (domain.references.indexOf(this.privateSubReferenceUuid) === -1) {
      domain.references.push(this.privateSubReferenceUuid);
    }
  }

  removeReference(domain: any): void {
    if (domain.references && domain.references.length) {
      const referenceUuidIndex = domain.references.indexOf(this.privateSubReferenceUuid);

      if (referenceUuidIndex > -1) {
        domain.references.splice(this.privateSubReferenceUuid, 1);
      }
    }
  }

  getDomainDisplay(obj: any, path: string, defaultValue: any = null): string {
    return String.prototype.split.call(path, /[,[\].]+?/)
      .filter(Boolean)
      .reduce((a: any, c: string) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue), obj);
  }

  isApplied(domain: any): boolean {
    return domain.references && domain.references.indexOf(this.privateSubReferenceUuid) > -1;
  }

}
