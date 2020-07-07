import {
    LazyLoadedComponentManifest,
    DynamicComponentManifest
} from '@gsrs-core/dynamic-component-loader';
import { SubstanceCountsComponent } from './substance-browse/substance-counts/substance-counts.component';
import { ShowApplicationToggleComponent } from './substance-browse/show-application-toggle/show-application-toggle.component';

export const fdaLazyLoadedComponentManifests: Array<LazyLoadedComponentManifest> = [
    {
        componentId: 'fda-substance-product',
        path: 'fda-substance-product',
        loadChildren: () => import('./substance-details/substance-products/substance-products.module').then(m => m.SubstanceProductsModule),
    }
];

export const fdaDynamicBrowseComponentManifests: Array<DynamicComponentManifest<ShowApplicationToggleComponent>> = [
    {
        component: ShowApplicationToggleComponent,
        componentType: 'browseHeader'
    }
];

export const fdaDynamicSubSummaryComponentManifests: Array<DynamicComponentManifest<SubstanceCountsComponent>> = [
    {
        component: SubstanceCountsComponent,
        componentType: 'summary'

    }
];


