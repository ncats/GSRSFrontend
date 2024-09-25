import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { domainKeys } from '../domain-references/domain-keys.constant';
import { DomainsWithReferences } from '../domain-references/domain.references.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { SubstanceFormReferencesService } from '../substance-form-references.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-apply-reference',
  templateUrl: './apply-reference.component.html',
  styleUrls: ['./apply-reference.component.scss']
})
export class ApplyReferenceComponent implements OnInit, OnDestroy {
  domainKeys = domainKeys;
  domainsWithReferences: DomainsWithReferences;
  private privateSubReferenceUuid: string;
  private subscriptions: Array< Subscription > = [];
  open = false;

  constructor(
    private substanceFormReferencesService: SubstanceFormReferencesService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  setOpen() {
    this.open = true;
    const subscription = this.substanceFormReferencesService.domainsWithReferences.pipe(take(1)).subscribe(domainsWithReferences => {
      this.domainsWithReferences = domainsWithReferences;
      this.setChecked();
    });
    this.subscriptions.push(subscription);
  }

  @Input()
  set subReferenceUuid(uuid: string) {
    this.privateSubReferenceUuid = uuid;
  }

  applyToAll(): void {
    this.applyReference(this.domainsWithReferences.definition.domain);
    this.domainKeys.forEach(key => {
      if (this.domainsWithReferences[key]) {
        this.domainsWithReferences[key].domains.forEach(domain => {
          this.applyReference(domain);
        });
      }
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

  close() {
    this.domainsWithReferences = null;
    this.open = false;
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  setChecked() {
    if(this.domainsWithReferences.definition && this.domainsWithReferences.definition.domain) {
      this.domainsWithReferences.definition.domain.checked = this.domainsWithReferences.definition.domain.references &&
      this.domainsWithReferences.definition.domain.references.indexOf(this.privateSubReferenceUuid) > -1;
    }
    this.domainKeys.forEach(domain => {
      if (this.domainsWithReferences[domain]) {
        if(this.domainsWithReferences[domain].domains) {
          this.domainsWithReferences[domain].domains.forEach(element => {
            element.checked = element.references && element.references.indexOf(this.privateSubReferenceUuid) > -1;
          });
        }
      }
    });
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
    this.substanceFormReferencesService.emitReferencesUpdate();
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
    return domain && domain.references && domain.references.indexOf(this.privateSubReferenceUuid) > -1;
  }

}
