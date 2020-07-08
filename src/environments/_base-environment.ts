import { Environment } from './environment.model';
import * as moment from 'moment';

export const baseEnvironment: Environment = {
    apiBaseUrl: 'https://ginas.ncats.nih.gov/ginas/app/',
    baseHref: '',
    clasicBaseHref: '',
    production: false,
    appId: 'gsrs',
    structureEditor: 'jsdraw',
    googleAnalyticsId: '',
    version: '2.3.4',
    isAnalyticsPrivate: false,
    contactEmail: 'ginas@mail.nih.gov',
    buildDateTime: moment().utc().format('ddd MMM D YYYY HH:mm:SS z')
};


// options for structureEditor are 'ketcher' or 'jsdraw'
