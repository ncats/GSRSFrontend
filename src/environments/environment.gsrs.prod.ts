import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.apiBaseUrl = '/ginas/app/';
environment.production = true;
environment.baseHref = '/ginas/app/ui/';
environment.clasicBaseHref = '/ginas/app/';
environment.appId = 'fda';
environment.googleAnalyticsId = null;
environment.isAnalyticsPrivate = true;

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
