import { SubstanceReference } from '../../substance/substance.model';
import { Subject, Observable } from 'rxjs';

export class DomainReferences {
    references: Array<SubstanceReference> = [];
    domain: any;
    private substanceReferences: Array<SubstanceReference> = [];
    // private domainReferencesSubject = new Subject();
    // domainReferencesUpdated = this.domainReferencesSubject.asObservable();

    constructor(domain: any = {}, substanceReferences: Array<SubstanceReference> = []) {
        this.domain = domain;
        this.substanceReferences = substanceReferences;
        this.loadReferences();
    }

    private loadReferences() {
        if (this.domain.references && this.domain.references.length) {
            this.domain.references.forEach((uuid: string) => {
                const substanceReference = this.substanceReferences.find(reference => reference.uuid === uuid);
                if (substanceReference != null) {
                    this.references.push(substanceReference);
                }
            });
        }
    }

    addDomainReference(uuid: string): void {
        if (this.domain.references.indexOf(uuid) === -1) {
            this.domain.references.push(uuid);
        }

        let substanceReference = this.references.find(reference => reference.uuid === uuid);
        if (substanceReference == null) {
            substanceReference = this.substanceReferences.find(reference => reference.uuid === uuid);
            if (substanceReference != null) {
                this.references.push(substanceReference);
            }
        }
        // this.domainReferencesSubject.next();
    }

    removeDomainReference(uuid: string): void {
        const referenceUuidIndex = this.domain.references.indexOf(uuid);
        if (referenceUuidIndex > -1) {
            this.domain.references.splice(referenceUuidIndex, 1);
        }
        const substanceReferenceIndex = this.references.findIndex(reference => reference.uuid === uuid);
        if (substanceReferenceIndex > -1) {
            this.references.splice(substanceReferenceIndex, 1);
        }
        // this.domainReferencesSubject.next();
    }
}
