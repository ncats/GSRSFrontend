import { baseEnvironment } from 'src/environments';

export const environment = baseEnvironment;
environment.appId = 'fda';
environment.apiBaseUrl = 'http://fdadev.ncats.io:9000/ginas/app/';
environment.clasicBaseHref = '/ginas/app/';
environment.googleAnalyticsId = 'UA-136176848-3';
environment.isAnalyticsPrivate = true;

export { FDA_ROUTES as EXTRA_ROUTES } from '../app/fda/fda.routes';

export { FDA_ENVIRONMENT_PROVIDERS as ENVIRONMENT_PROVIDERS } from '../app/fda/fda.providers';
