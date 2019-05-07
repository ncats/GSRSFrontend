import {
    DynamicComponentManifest,
} from '@gsrs-core/dynamic-component-loader/dynamic-component-loader.module';

export const fdaDynamicComponentManifests: Array<DynamicComponentManifest> = [
    {
        componentId: 'fda-substance-product',
        path: 'fda-substance-product',
        loadChildren: './substance-details/substance-products/substance-products.module#SubstanceProductsModule',
    }
];
