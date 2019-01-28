import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.version = 'fda';

export { AbaseModule as EnvironmentModule } from '../app/abase.module';
