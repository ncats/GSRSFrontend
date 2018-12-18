import {
    DynamicComponentManifest,
} from './dynamic-component-loader/dynamic-component-loader.module';

export const dynamicComponentManifests: DynamicComponentManifest[] = [
    {
        componentId: 'structure-details',
        path: 'structure-details',
        loadChildren: './structure/structure-details/structure-details.module#StructureDetailsModule',
    },
];
