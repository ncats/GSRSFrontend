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
    valid?: boolean;
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

export interface SubunitSequence {
  subunitIndex: number;
  sequencesSectionGroups: Array<SequenceSectionGroup>;
}


export interface SequenceSectionGroup {
  sequenceSections: Array<SequenceSection>;
}

export interface SequenceSection {
  sectionNumber: number;
  sectionUnits: Array<SequenceUnit>;
}

export interface SequenceUnit {
  unitIndex: number;
  unitValue: string;
}
export interface DisplaySite {
  type: string;
  subunit: number;
  residue: number;
}
