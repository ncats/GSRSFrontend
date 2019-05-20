import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
<<<<<<< HEAD
environment.apiBaseUrl = 'http://localhost:9000/ginas/app/';
environment.version = 'fda';
environment.navItems = [
    {
        display: 'FDA Sample Path',
        path: 'fda-sample-path'
    },
    {
        display: 'FDA Sample Inheritance',
        path: 'fda-sample-inheritance'
    }
];
=======
environment.appId = 'fda';
// environment.navItems = [
//     {
//         display: 'FDA Sample Path',
//         path: 'fda-sample-path'
//     },
//     {
//         display: 'FDA Sample Inheritance',
//         path: 'fda-sample-inheritance'
//     }
// ];
environment.isAnalyticsPrivate = true;
environment.configFileLocation = '/assets/data/config-fda.json';
environment.apiBaseUrl = 'http://localhost:9000/ginas/app/';
>>>>>>> d2f0a1a2d5ea3e871964a35269ff5e0380fa630e

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
