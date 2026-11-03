import { Provider, EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { LAZY_LOADED_COMPONENT_DEFINITIONS, DYNAMIC_COMPONENT_MANIFESTS } from '@gsrs-core/dynamic-component-loader';
// eslint-disable-next-line max-len
import { fdaLazyLoadedComponentDefinitions, fdaDynamicSubSummaryComponentManifests, fdaDynamicBrowseComponentManifests } from './fda-dynamic-componet-manifests';
import { SubstanceCardsModule } from '@gsrs-core/substance-details';
import { fdaSubstanceCardsFilters } from './substance-details/fda-substance-cards-filters.constant';

/**
 * Replaces fda.module.ts as the FDA-build-only provider contribution, consumed via
 * ENVIRONMENT_PROVIDERS in the fda.*.ts environment files. FdaModule no longer declares
 * any components (SubstanceCountsComponent/ShowApplicationToggleComponent are standalone),
 * so it has nothing left to do except carry these providers.
 */
export const FDA_ENVIRONMENT_PROVIDERS: Array<Provider | EnvironmentProviders> = [
  // second SubstanceCardsModule.forRoot() registration (base app.config.ts already calls it
  // once with the default filters) — SUBSTANCE_CARDS_FILTERS is multi:true so both filter
  // arrays merge for fda builds, exactly as today. Do not collapse to a single call.
  importProvidersFrom(SubstanceCardsModule.forRoot(fdaSubstanceCardsFilters)),
  // consumed by DynamicComponentLoader.getDynamicComponent()
  { provide: LAZY_LOADED_COMPONENT_DEFINITIONS, useValue: fdaLazyLoadedComponentDefinitions, multi: true },
  // separate mechanism (DynamicComponentManifest<T>/DYNAMIC_COMPONENT_MANIFESTS), consumed directly by
  // import-browse/import-summary/substances-browse/substance-summary-card via resolveComponentFactory()
  { provide: DYNAMIC_COMPONENT_MANIFESTS, useValue: fdaDynamicSubSummaryComponentManifests, multi: true },
  { provide: DYNAMIC_COMPONENT_MANIFESTS, useValue: fdaDynamicBrowseComponentManifests, multi: true },
];
