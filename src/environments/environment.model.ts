export interface Environment {
    apiBaseUrl: string;
    configFileLocation?: string;
    baseHref: string;
    clasicBaseHref: string;
    production: boolean;
    appId: 'fda' | 'gsrs';
    structureEditor: 'ketcher' | 'jsdraw';
    googleAnalyticsId: string;
    version: string;
    isAnalyticsPrivate: boolean;
    contactEmail: string;
}

