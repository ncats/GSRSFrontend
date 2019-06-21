import { SubstanceRelationship } from '../substance/substance.model';

export interface SubstanceFormDefinition {
    uuid?: string;
    substanceClass?: string;
    definitionType?: string;
    definitionLevel?: string;
    deprecated?: boolean;
    references?: Array<string>;
    access?: Array<string>;
    relationships?: Array<SubstanceRelationship>;
}

export interface SubstanceFormResults {
    isSuccessfull: boolean;
}
