import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.version = 'gsrs';

export { GsrsModule as EnvironmentModule } from '../app/gsrs.module';
