import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.apiBaseUrl = '/gsrs/app/';
environment.production = true;
environment.baseHref = '/gsrs/app/beta/';
environment.clasicBaseHref = '/gsrs/app/';
environment.appId = 'cbg';
environment.googleAnalyticsId = 'UA-136176848-1';

export { GsrsModule as EnvironmentModule } from '../gsrs.module';
