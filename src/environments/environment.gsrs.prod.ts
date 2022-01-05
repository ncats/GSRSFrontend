import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.apiBaseUrl = '/ginas/app/';
environment.production = true;
environment.baseHref = '/ginas/app/beta/';
environment.clasicBaseHref = '/ginas/app/';
environment.appId = 'gsrs';
environment.googleAnalyticsId = 'UA-136176848-1';

export { GsrsModule as EnvironmentModule } from '../app/core/gsrs.module';
