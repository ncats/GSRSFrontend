import { baseEnvironment } from 'src/environments';

export const environment = baseEnvironment;
environment.apiBaseUrl = '/ginas/app/';
environment.production = true;
environment.baseHref = '';
environment.clasicBaseHref = '/ginas/app/';
environment.appId = 'fda';
environment.googleAnalyticsId = 'UA-136176848-3';
environment.isAnalyticsPrivate = true;

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
