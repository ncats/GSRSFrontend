import {
    LazyLoadedComponentDefinition,
    DynamicComponentManifest
} from '@gsrs-core/dynamic-component-loader';
import { SubstanceCountsComponent } from './substance-browse/substance-counts/substance-counts.component';
import { ShowApplicationToggleComponent } from './substance-browse/show-application-toggle/show-application-toggle.component';

export const fdaLazyLoadedComponentDefinitions: Array<LazyLoadedComponentDefinition> = [
    {
        componentId: 'fda-substance-product',
        loadComponent: () => import('./substance-details/substance-products/substance-products.component').then(m => m.SubstanceProductsComponent),
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


