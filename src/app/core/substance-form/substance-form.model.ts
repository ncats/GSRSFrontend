import { SubstanceRelationship } from '../substance/substance.model';

export interface SubstanceFormDefinition {
    uuid?: string;
    substanceClass?: string;
    definitionType?: string;
    definitionLevel?: string;
    created?: number;
    createdBy?: string;
    lastEdited?: number;
    lastEditedBy?: string;
    deprecated?: boolean;
    references?: Array<string>;
    access?: Array<string>;
    status?: string;
    approvalID?: string;
    _name?: string;
    _name_html?: string;
    relationships?: Array<SubstanceRelationship>;
    tags?: Array<string>;
}

export interface SubstanceFormResults {
    uuid?: string;
    isSuccessfull: boolean;
    valid?: boolean;
    validationMessages?: Array<ValidationMessage>;
    serverError?: any;
    fileUrl?: string;	// For precisionFDA
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

export interface StructureDuplicationMessage {
  links?: Array<MessageLink>;
  message: string;
  messageType: string;
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
  class?: string;
  type?: string;
}
export interface DisplaySite {
  type: string;
  subunit: number;
  residue: number;
}
