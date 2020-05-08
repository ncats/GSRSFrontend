import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.appId = 'fda';
environment.apiBaseUrl = 'http://fdadev.ncats.io:9000/ginas/app/';
environment.clasicBaseHref = '/ginas/app/';
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
environment.configFileLocation = '/assets/data/config-fda.json';
environment.isAnalyticsPrivate = true;

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
