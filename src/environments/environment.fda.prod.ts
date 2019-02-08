import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.production = true;
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

export { AbaseModule as EnvironmentModule } from '../app/abase.module';
