import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.production = true;
environment.baseHref = '/ginas/app/beta/';
environment.version = 'gsrs';

export { GsrsModule as EnvironmentModule } from '../app/gsrs.module';
