import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.production = true;
environment.version = 'gsrs';

export { GsrsModule as EnvironmentModule } from '../app/gsrs.module';
