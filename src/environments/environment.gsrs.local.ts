import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.appId = 'gsrs';
environment.apiBaseUrl = 'http://localhost:9000/ginas/app/';

export { GsrsModule as EnvironmentModule } from '../app/core/gsrs.module';
