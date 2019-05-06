import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
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

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
