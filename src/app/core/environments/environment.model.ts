export interface Environment {
    apiBaseUrl: string;
    configFileLocation?: string;
    baseHref: string;
    clasicBaseHref: string;
    production: boolean;
    appId: 'fda' | 'gsrs' | 'cbg';
    structureEditor: 'ketcher' | 'jsdraw';
    navItems: Array<NavItem>;
    googleAnalyticsId: string;
    version: string;
    isAnalyticsPrivate: boolean;
    contactEmail: string;
}

export interface NavItem {
    display: string;
    path: string;
    order?: number;
}
