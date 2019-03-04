import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.version = 'abase';

export { AbaseModule as EnvironmentModule } from '../app/abase.module';
