import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.version = 'inxight';

export { InxightModule as EnvironmentModule } from '../app/inxight.module';
