import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.appId = 'fda';
environment.navItems = [
    {
        display: 'Browse Application',
        path: 'browse-applications'
    },
    {
        display: 'Browse Clinical Trials',
        path: 'browse-clinical-trials'
    }
];
environment.googleAnalyticsId = 'UA-136176848-3';
environment.configFileLocation = '/assets/data/config-fda.json';
environment.isAnalyticsPrivate = true;

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
