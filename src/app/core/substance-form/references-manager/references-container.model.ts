import { SubstanceReference } from '../../substance/substance.model';

export interface ReferencesContainer {
    domainReferences?: Array<string>;
    substanceReferences: Array<SubstanceReference>;
}
