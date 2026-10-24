import { baseEnvironment } from 'src/environments';

export const environment = baseEnvironment;
environment.apiBaseUrl = '/ginas/app/';
environment.production = true;
environment.baseHref = '';
environment.clasicBaseHref = '/ginas/app/';
environment.appId = 'fda';
/*environment.googleAnalyticsId = 'UA-136176848-3';*/
environment.isAnalyticsPrivate = true;

export { FDA_ROUTES as EXTRA_ROUTES } from '../app/fda/fda.routes';

export { FDA_ENVIRONMENT_PROVIDERS as ENVIRONMENT_PROVIDERS } from '../app/fda/fda.providers';
