import { baseEnvironment } from 'src/environments';

export const environment = baseEnvironment;
environment.appId = 'fda';
environment.clasicBaseHref = '/ginas/app/';
environment.baseHref = '';

environment.appId = 'fda';
environment.isAnalyticsPrivate = true;
environment.structureEditor = 'jsdraw';

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
