import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.appId = 'abase';

export { AbaseModule as EnvironmentModule } from '../app/abase.module';
