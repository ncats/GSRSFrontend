import { baseEnvironment } from 'src/environments';

export const environment = baseEnvironment;
environment.appId = 'fda';
environment.apiBaseUrl = 'http://fdadev.ncats.io:9000/ginas/app/';
environment.clasicBaseHref = '/ginas/app/';
environment.googleAnalyticsId = 'UA-136176848-3';
environment.isAnalyticsPrivate = true;

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
