export interface Config {
    apiBaseUrl?: string;
    apiUrlDomain?: string;
    googleAnalyticsId?: string;
    version?: string;
    substanceDetailsCards?: Array<SubstanceDetailsCard>;
    facets?: {
        [name: string]: {
            [permission: string]: Array<string>
        }
    };
    codeSystemOrder?: Array<string>;
    contactEmail?: string;
    defaultCodeSystem?: string;
    navItems?: Array<NavItem>;
    substanceSelectorProperties?: Array<string>;
    displayMatchApplication?: string;
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

export interface NavItem {
    display: string;
    path?: string;
    order?: number;
    children?: Array<NavItem>;
}
