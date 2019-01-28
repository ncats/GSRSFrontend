import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.version = 'fda';

export { FdaModule as EnvironmentModule } from '../app/fda.module';
