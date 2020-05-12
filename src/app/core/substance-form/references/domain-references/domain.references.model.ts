export interface DomainsWithReferences {
    definition?: DefinitionObject;
    names?: DomainList;
    codes?: DomainList;
    relationships?: DomainList;
    notes?: DomainList;
    properties?: DomainList;
}

export interface DefinitionObject {
    subClass: string;
    domain: any;
}

export interface DomainList {
    listDisplay: string;
    displayKey: string;
    domains: Array<any>;
}
