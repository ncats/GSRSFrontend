import { baseEnvironment } from 'src/environments';

export const environment = baseEnvironment;
environment.appId = 'fda';
// environment.baseHref = '/ginas/app/beta/';
environment.clasicBaseHref = '/ginas/app/';
// __alex__ should make change here.
environment.appId = 'fda';
environment.isAnalyticsPrivate = true;

environment.apiBaseUrl = 'http://localhost:9000/ginas/app/';

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
