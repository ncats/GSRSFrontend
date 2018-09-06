export interface SubstanceBase {
    uuid: string;
    created: number;
    createdBy: string;
    lastEdited: number;
    lastEditedBy: string;
    deprecated: boolean;
}

export interface SubstanceSummary extends SubstanceBase {
    definitionType: string;
    definitionLevel: string;
    substanceClass: string;
    status: string;
    version: string;
    approvedBy: string;
    approvalID: string;
    structurallyDiverse: StructurallyDiverse;
    _names: SubstanceReference;
    _modifications: SubstanceReference;
    _references: SubstanceReference;
    _codes: SubstanceReference;
    _relationships: SubstanceReference;
    _approvalIDDisplay: string;
    _name: string;
    access: Array<string>;
    _self: string;
}

export interface StructurallyDiverse extends SubstanceBase {
    sourceMaterialClass: string;
    sourceMaterialType: string;
    part: Array<string>;
    parentSubstance: SubstanceParent;
    references: Array<string>;
    access: Array<string>;
}

export interface SubstanceParent extends SubstanceBase {
    refPname: string;
    refuuid: string;
    substanceClass: string;
    approvalID: string;
    linkingID: string;
    name: string;
    references: Array<string>;
    access: Array<string>;
}

export interface SubstanceReference {
    count: number;
    href: string;
}
