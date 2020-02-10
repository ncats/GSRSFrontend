import { Environment } from './environment.model';

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


// options for structureEditor are 'ketcher' or 'jsdraw'
