export interface Config {
    apiBaseUrl?: string;
    substanceDetailsCards?: Array<SubstanceDetailsCard>;
    facets?: { [permission: string]: Array<string> };
    specialRelationships?: Array<SpecialRelationship>;
}

export interface SubstanceDetailsCard {
    card: string;
    title?: string;
    filters?: Array<SubstanceDetailsCardFilter>;
}

export interface SubstanceDetailsCardFilter {
    filterName: string;
    propertyToCheck?: string;
    value?: string;
}

export interface SpecialRelationship {
    type: string;
    display: string;
}
