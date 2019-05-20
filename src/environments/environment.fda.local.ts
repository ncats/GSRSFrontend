import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.apiBaseUrl = 'http://localhost:9000/ginas/app/';
environment.version = 'fda';
environment.navItems = [
    // {
    //     display: 'FDA Sample Path',
    //     path: 'fda-sample-path'
    // },
    // {
    //     display: 'FDA Sample Inheritance',
    //     path: 'fda-sample-inheritance'
    // }
    {
        display: 'Browse Clinical Trials',
        path: 'browse-clinical-trials'
    }
];

export { FdaModule as EnvironmentModule } from '../app/fda.module';
