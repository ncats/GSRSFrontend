import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.appId = 'inxight';

export { InxightModule as EnvironmentModule } from '../app/inxight.module';
