import { SubstanceReference, SubstanceDetail } from '../../substance/substance.model';

export interface ReferencesContainer {
    domainReferences?: Array<string>;
    substanceReferences: Array<SubstanceReference>;
    substance?: SubstanceDetail;
}
