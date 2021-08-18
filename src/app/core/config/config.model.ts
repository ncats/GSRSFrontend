export interface Config {
    apiBaseUrl?: string;
    apiUrlDomain?: string;
    googleAnalyticsId?: string;
    version?: string;
    buildDateTime?: string;
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
    adverseEventShinyHomepageDisplay?: string;
    adverseEventShinySubstanceNameDisplay?: string;
    adverseEventShinyAdverseEventDisplay?: string;
    adverseEventShinyHomepageURL?: string;
    adverseEventShinySubstanceNameURL?: string;
    adverseEventShinyAdverseEventURL?: string;
    facetDisplay?: Array<any>;
    relationshipsVisualizationUri?: string;
    homeDynamicLinks?: Array<any>;
    registrarDynamicLinks?: Array<any>;
    registrarDynamicLinks2?: Array<any>;
    bannerMessage?: string;
    substance?: any;
    showOldLinks?: boolean;
    loadedComponents?: LoadedComponents;
    showNameStandardizeButton?: boolean;
}

export interface LoadedComponents {
    applications?: boolean;
    products?: boolean;
    clinicaltrials?: boolean;
    adverseevents?: boolean;
    impurities?: boolean;
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
    externalPath?: string;
    order?: number;
    children?: Array<NavItem>;
}
