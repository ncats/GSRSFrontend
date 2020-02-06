import { SubstanceReference } from '../../substance/substance.model';


export interface ReuseReferencesDialogData {
    domainRefereceUuids: Array<string>;
    substanceReferences: Array<SubstanceReference>;
}
