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
    uuid?: string;
    isSuccessfull: boolean;
    validationMessages?: Array<ValidationMessage>;
}

export interface ValidationResults {
  valid?: boolean;
  validationMessages?: Array<ValidationMessage>;
}

export interface ValidationMessage {
    actionType: string;
    appliedChange: boolean;
    links: Array<MessageLink>;
    message: string;
    messageType: string;
    suggestedChange: boolean;
}

export interface MessageLink {
  href: string;
  text: string;
}
