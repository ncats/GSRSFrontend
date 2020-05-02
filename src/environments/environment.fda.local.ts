import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
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
    },
    {
        display: 'Register Product',
        path: 'product/register'
    }
];
environment.appId = 'fda';
environment.isAnalyticsPrivate = true;
environment.configFileLocation = '/assets/data/config-fda.json';

environment.apiBaseUrl = 'http://localhost:9000/ginas/app/';

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
