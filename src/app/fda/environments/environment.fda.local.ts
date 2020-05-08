import { baseEnvironment } from '@gsrs-core/environments';

export const environment = baseEnvironment;
environment.appId = 'fda';
environment.baseHref = '/ginas/app/beta/';
environment.clasicBaseHref = '/ginas/app/';
// __alex__ should make change here.
environment.navItems = [
    {
        display: 'Browse Application',
        path: 'browse-applications'
    },
    {
        display: 'Browse Clinical Trials',
        path: 'browse-clinical-trials'
    },
    {
        display: 'Register Application',
        path: 'application/register'
    }
];
environment.appId = 'fda';
environment.isAnalyticsPrivate = true;
environment.configFileLocation = '/assets/data/config-fda.json';

environment.apiBaseUrl = 'http://localhost:9000/ginas/app/';

export { FdaModule as EnvironmentModule } from '../fda.module';
