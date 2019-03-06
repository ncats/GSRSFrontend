import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.version = 'fda';
environment.baseHref = '/ginas/app/beta/';
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

export { FdaModule as EnvironmentModule } from '../app/fda.module';
