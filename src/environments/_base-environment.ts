export const baseEnvironment: Environment = {
    apiBaseUrl: 'https://ginas.ncats.nih.gov/ginas/app/',
    baseHref: '',
    production: false,
    appId: 'gsrs',
    structureEditor: 'jsdraw',
    navItems: [],
    googleAnalyticsId: '',
    version: '2.3.4',
    isAnalyticsPrivate: false
};

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
}

export interface NavItem {
    display: string;
    path: string;
}


// options for structureEditor are 'ketcher' or 'jsdraw'
