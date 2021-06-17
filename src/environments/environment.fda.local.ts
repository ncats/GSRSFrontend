import { baseEnvironment } from 'src/environments';

export const environment = baseEnvironment;
environment.appId = 'fda';
environment.clasicBaseHref = '/ginas/app/';
// __alex__ should make change here.
environment.appId = 'fda';
environment.isAnalyticsPrivate = true;

// environment.apiBaseUrl = 'http://localhost:9000/ginas/app/';
environment.apiBaseUrl = 'http://localhost:8080/';
export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
