export interface Environment {
    apiBaseUrl: string;
    configFileLocation?: string;
    baseHref: string;
    production: boolean;
    appId: 'fda' | 'gsrs';
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
}
