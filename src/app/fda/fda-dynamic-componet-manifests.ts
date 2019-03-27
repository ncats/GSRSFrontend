import {
    DynamicComponentManifest,
} from '../core/dynamic-component-loader/dynamic-component-loader.module';

export const fdaDynamicComponentManifests: DynamicComponentManifest[] = [
    {
        componentId: 'fda-sample-card',
        path: 'fda-sample-card',
        loadChildren: './substance-details/sample-card/sample-card.module#SampleCardModule',
    },
];
