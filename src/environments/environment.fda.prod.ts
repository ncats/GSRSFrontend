import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.apiBaseUrl = '/ginas/app/';
environment.production = true;
environment.baseHref = '/ginas/app/beta/';
environment.clasicBaseHref = '/ginas/app/';
environment.appId = 'fda';
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
environment.googleAnalyticsId = 'UA-136176848-3';
environment.isAnalyticsPrivate = true;
environment.configFileLocation = '/ginas/app/beta/assets/data/config-fda.json';

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
