export interface Config {
    apiBaseUrl?: string;
    apiUrlDomain?: string;
    googleAnalyticsId?: string;
    version?: string;
    buildDateTime?: string;
    substanceDetailsCards?: Array<SubstanceDetailsCard>;
    facets?: {
        [name: string]: {
            [permission: string]: Array<string>;
        };
    };
    codeSystemOrder?: Array<string>;
    contactEmail?: string;
    defaultCodeSystem?: string;
    primaryCode?: string;
    typeaheadFields?: Array<string>;
    navItems?: Array<NavItem>;
    substanceSelectorProperties?: Array<string>;
    displayMatchApplication?: string;
    adverseEventShinyHomepageDisplay?: string;
    adverseEventShinySubstanceNameDisplay?: string;
    adverseEventShinyAdverseEventDisplay?: string;
    adverseEventShinyHomepageURL?: string;
    adverseEventShinySubstanceNameURL?: string;
    adverseEventShinyAdverseEventURL?: string;
    // eslint-disable-next-line member-delimiter-style
    FAERSDashboardAdverseEventUrl?: string;
    advancedSearchFacetDisplay?: boolean;
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
    molWeightRounding?: number;
    usefulLinks?: Array<UsefulLink>;
    approvalCodeName?: string;
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
    countMinimum?: number;
    countMaximum?: number;
}

export interface NavItem {
    display: string;
    path?: string;
    externalPath?: string;
    order?: number;
    children?: Array<NavItem>;
    component?: string;
}

export interface UsefulLink {
    title: string;
    description: string;
    href: string;
    imageFile: string;
    linkHref: string;
    templateDescription?: string;
}
