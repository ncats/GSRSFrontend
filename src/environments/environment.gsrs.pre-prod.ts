import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.appId = 'gsrs';
environment.googleAnalyticsId = 'UA-136176848-1';

export { GsrsModule as EnvironmentModule } from '../app/core/gsrs.module';
