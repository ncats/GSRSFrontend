import { Auth } from "@gsrs-core/auth";

export interface Config {
    apiBaseUrl?: string;
    gsrsHomeBaseUrl?: string;
    apiSSG4mBaseUrl?: string;
    apiUrlDomain?: string;
    logoutRedirectUrl?: string;
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
    homeHeader?: string;
    homeContents?: string;
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
    dailyMedUrl?: string;
    advancedSearchFacetDisplay?: boolean;
    facetDisplay?: Array<any>;
    relationshipsVisualizationUri?: string;
    customToolbarComponent?: string;
    sessionExpirationWarning?: SessionExpirationWarning;
    disableReferenceDocumentUpload?: boolean;
    externalSiteWarning?: ExternalSiteWarning;
    pfdaBaseUrl?: string;
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
    approvalType?: string;
    ssg4Form?: string;
    filteredDuplicationCodes?: Array<string>;
    autoSaveWait?: number;
    authenticateAs?: AuthenticateAs;
    userRegistration?: any
    elementLabelDisplay?:any;
    bulkSearch?: any
    useDataUrl?: any;
    userProfile?: any;
    stagingArea?: StagingAreaSettings;
    privacyStatement: string;
    CVDisplayOrder ?: {
            [name: string]: Array<string>;
    };
    codeSystemMapping?: {
        [code: string]: string;
    };
    citationMapping?: {
        [code: string]: string;
    };
    structureEditor?: 'ketcher' | 'jsdraw';
    nameFormPageSizeOptions?: Array<number>;
    nameFormPageSizeDefault?: number;
    jsdrawLicense?: boolean;
    disableKetcher?: boolean;
    useApprovalAPI?: boolean;
    dummyWhoami?: Auth;
    enableStructureFeatures?: boolean;
    StructureFeaturePriority?: Array<string>;
    structureEditSearch?: boolean;
}

export interface StagingAreaSettings {
    mergeAction?: boolean;
}

export interface LoadedComponents {
    applications?: boolean;
    products?: boolean;
    clinicaltrials?: boolean;
    adverseevents?: boolean;
    impurities?: boolean;
    ssg4m?: boolean;
    invitropharmacology?: boolean;
    userRegistration?: boolean;
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
    id?:string;
    kind?: string;
    path?: string;
    externalPath?: string;
    mailToPath?: string;
    queryParams?: any;
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

export interface AuthenticateAs {
    apiUsername?: string,
    apiPassword?: string,
    apiKey?: string,
    apiToken?: string;
}

export interface SessionExpirationWarning {
    maxSessionDurationMinutes: number;
    extendSessionApiUrl: string;
}

export interface ExternalSiteWarning {
    enabled: boolean;
    dialogTitle: string;
    dialogMessage: string;
}
