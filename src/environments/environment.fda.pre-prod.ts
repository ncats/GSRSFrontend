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
environment.googleAnalyticsId = 'UA-136176848-3';
environment.isAnalyticsPrivate = true;

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
