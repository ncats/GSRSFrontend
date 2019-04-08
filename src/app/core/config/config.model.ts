export interface Config {
    apiBaseUrl?: string;
    googleAnalyticsId?: string;
    version?: string;
    substanceDetailsCards?: Array<SubstanceDetailsCard>;
    facets?: { [permission: string]: Array<string> };
    specialRelationships?: Array<SpecialRelationship>;
}

export interface SubstanceDetailsCard {
    card: string;
    title?: string;
    filters?: Array<SubstanceCardFilterParameters>;
}

export interface SubstanceCardFilterParameters {
    filterName: string;
    propertyToCheck?: string;
    value?: string;
    propertyInArray?: string;
    order?: number;
}

export interface SpecialRelationship {
    type: string;
    display: string;
}
