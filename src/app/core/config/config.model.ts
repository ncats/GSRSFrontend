export interface Config {
    apiBaseUrl?: string;
    googleAnalyticsId?: string;
    version?: string;
    substanceDetailsCards?: Array<SubstanceDetailsCard>;
    facets?: { [permission: string]: Array<string> };
}

export interface SubstanceDetailsCard {
    card: string;
    title?: string;
    filters?: Array<SubstanceCardFilterParameters>;
    type?: string;
    order?: number;
}

export interface SubstanceCardFilterParameters {
    filterName: string;
    propertyToCheck?: string;
    value?: any;
    propertyInArray?: string;
    order?: number;
}
