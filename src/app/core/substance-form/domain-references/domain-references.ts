import { SubstanceReference } from '../../substance/substance.model';
import { Subject, Observable } from 'rxjs';
import { UtilsService } from '../../utils/utils.service';

export class DomainReferences {
    references: Array<SubstanceReference> = [];
    domain: any;
    private domainReferencesSubject = new Subject();
    domainReferencesUpdated = this.domainReferencesSubject.asObservable();

    constructor(
        domain: any = {},
        private privateSubstanceReferences: Array<SubstanceReference> = [],
        private utilsService: UtilsService) {
        this.domain = domain;
        this.loadReferences();
    }

    private loadReferences() {
        if (this.domain.references && this.domain.references.length) {
            this.domain.references.forEach((uuid: string) => {
                const substanceReference = this.privateSubstanceReferences.find(reference => reference.uuid === uuid);
                if (substanceReference != null) {
                    this.references.push(substanceReference);
                }
            });
        }
    }

    get substanceReferences(): Array<SubstanceReference> {
        return this.privateSubstanceReferences;
    }

    get domainReferenceUuids(): Array<string> {
        return this.domain.references;
    }

    getSubstanceReference(uuid: string): SubstanceReference {
        const reference = this.privateSubstanceReferences.find(substanceReference => substanceReference.uuid === uuid);
        return reference;
    }

    addDomainReference(uuid: string): void {
        if (this.domain.references.indexOf(uuid) === -1) {
            this.domain.references.push(uuid);
        }

        let substanceReference = this.references.find(reference => reference.uuid === uuid);
        if (substanceReference == null) {
            substanceReference = this.privateSubstanceReferences.find(reference => reference.uuid === uuid);
            if (substanceReference != null) {
                this.references.push(substanceReference);
            }
        }
        this.domainReferencesSubject.next();
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
        this.domainReferencesSubject.next();
    }

    createSubstanceReference(reference: SubstanceReference): SubstanceReference {
        reference.uuid = this.utilsService.newUUID();
        this.privateSubstanceReferences.unshift(reference);
        return reference;
    }

    updateDomainReferences(referenceUuids: Array<string>): void {
        this.domain.references = referenceUuids || [];
        const references = [];
        this.domain.references.forEach((uuid: string) => {
            const substanceReference = this.privateSubstanceReferences.find(reference => reference.uuid === uuid);
            if (substanceReference != null) {
                references.push(substanceReference);
            }
        });
        this.references = references;
        this.domainReferencesSubject.next();
    }
}
