export interface SubstanceBase {
    uuid: string;
    created: number;
    createdBy: string;
    lastEdited: number;
    lastEditedBy: string;
    deprecated: boolean;
    access: Array<string>;
}

export interface SubstanceBaseExtended {
    definitionType: string;
    definitionLevel: string;
    substanceClass: string;
    status: string;
    version: string;
    approvedBy: string;
    approvalID: string;
    structurallyDiverse: StructurallyDiverse;
    _approvalIDDisplay: string;
    _name: string;
    _self: string;
}

export interface SubstanceSummary extends SubstanceBase, SubstanceBaseExtended {
    _names: CountRef;
    _modifications: CountRef;
    _references: CountRef;
    _codes: CountRef;
    _relationships: CountRef;
}

export interface SubstanceDetail extends SubstanceBase, SubstanceBaseExtended {
    names: Array<SubstanceName>;
    codes: Array<SubstanceCode>;
    properties: Array<SubstanceProperty>;
    relationships: Array<SubstanceRelationship>;
    references: Array<SubstanceReference>;
    codeSystemNames: Array<string>;
    codeSystems: { [codeSystem: string]: Array<SubstanceCode> };
}

export interface StructurallyDiverse extends SubstanceBase {
    sourceMaterialClass: string;
    sourceMaterialType: string;
    part: Array<string>;
    parentSubstance: SubstanceRelated;
    references: Array<string>;
}

export interface SubstanceRelated extends SubstanceBase {
    refPname: string;
    refuuid: string;
    substanceClass: string;
    approvalID: string;
    linkingID: string;
    name: string;
    references: Array<string>;
}

export interface CountRef {
    count: number;
    href: string;
}

export interface SubstanceName extends SubstanceBase {
    name: string;
    type: string;
    domains: Array<string>;
    languages: Array<string>;
    nameJurisdiction: Array<string>;
    nameOrgs: Array<string>;
    preferred: boolean;
    displayName: boolean;
    references: Array<string>;
    _self: string;
}

export interface SubstanceCode extends SubstanceBase {
    codeSystem: string;
    code: string;
    comments: string;
    type: string;
    url: string;
    references: Array<string>;
    _self: string;
}

export interface SubstanceNote extends SubstanceBase {
    note: string;
    references: Array<string>;
}

export interface SubstanceProperty extends SubstanceBase {
    name: string;
    type: string;
    propertyType: string;
    value: SubstanceAmount;
    defining: boolean;
    parameters: Array<any>;
}

export interface SubstanceRelationship extends SubstanceBase {
    comments: string;
    interactionType: string;
    qualification: string;
    relatedSubstance: SubstanceRelated;
    originatorUuid: string;
    type: string;
    references: Array<string>;
}

export interface SubstanceAmount extends SubstanceBase {
    units: string;
    references: Array<SubstanceReference>;
}

export interface SubstanceReference extends SubstanceBase {
    citation: string;
    docType: string;
    publicDomain: boolean;
    tags: Array<string>;
    url: string;
    _self: string;
}
