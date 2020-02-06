import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.apiBaseUrl = '/ginas/app/';
environment.production = true;
environment.baseHref = '/ginas/app/beta/';
environment.appId = 'fda';
environment.navItems = [
//     {
//         display: 'FDA Sample Path',
//         path: 'fda-sample-path'
//     },
//     {
//         display: 'FDA Sample Inheritance',
//         path: 'fda-sample-inheritance'
//     }
    {
        display: 'Browse Clinical Trials',
        path: 'browse-clinical-trials'
    }
];
environment.googleAnalyticsId = 'UA-136176848-3';
environment.isAnalyticsPrivate = true;
environment.configFileLocation = '/ginas/app/beta/assets/data/config-fda.json';

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
