import { SubstanceReference } from '../../substance/substance.model';
import { Subject, Observable } from 'rxjs';

export class DomainReferences {
    references: Array<SubstanceReference> = [];
    domain: any;
    // private domainReferencesSubject = new Subject();
    // domainReferencesUpdated = this.domainReferencesSubject.asObservable();

    constructor(domain: any = {}, private substanceReferences: Array<SubstanceReference> = []) {
        this.domain = domain;
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

    getSubstanceReference(uuid: string): SubstanceReference {
        const reference = this.substanceReferences.find(substanceReference => substanceReference.uuid === uuid);
        return reference;
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
    }
}
