import {
    LazyLoadedComponentManifest,
} from '@gsrs-core/dynamic-component-loader';

export const fdaDynamicComponentManifests: Array<LazyLoadedComponentManifest> = [
    {
        componentId: 'fda-substance-product',
        path: 'fda-substance-product',
        loadChildren: () => import('./substance-details/substance-products/substance-products.module').then(m => m.SubstanceProductsModule),
    }
];
