import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader';
import { fdaLazyLoadedComponentManifests, fdaDynamicSubSummaryComponentManifests } from './fda-dynamic-componet-manifests';
import { SubstanceCardsModule } from '@gsrs-core/substance-details';
import { fdaSubstanceCardsFilters } from './substance-details/fda-substance-cards-filters.constant';
import { ProductService } from './product/service/product.service';
import { MatCardModule } from '@angular/material/card';
import { ClinicalTrialsModule } from './clinical-trials/clinical-trials.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { SubstanceCountsComponent } from './substance-browse/substance-counts/substance-counts.component';
import { ApplicationsModule} from './applications/applications.module';
import { ProductModule} from './product/product.module';
import { GeneralService} from './service/general.service';
import { MatTabsModule } from '@angular/material/tabs';

import { ApplicationsBrowseComponent } from './applications/applications-browse/applications-browse.component';
import { ClinicalTrialsBrowseComponent } from './clinical-trials/clinical-trials-browse/clinical-trials-browse.component';
import { SsoRefreshService } from './service/sso-refresh.service';

const fdaRoutes: Routes = [
  {
    path: 'browse-applications',
    component: ApplicationsBrowseComponent
  },
  {
    path: 'browse-clinical-trial',
    component: ClinicalTrialsBrowseComponent
  }
];

export function init_sso_refresh_service(ssoService: SsoRefreshService) {
  return() => {
    ssoService.init();
  };
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(fdaRoutes),
    DynamicComponentLoaderModule.forRoot(fdaLazyLoadedComponentManifests, fdaDynamicSubSummaryComponentManifests),
    SubstanceCardsModule.forRoot(fdaSubstanceCardsFilters),
    MatCardModule,
    MatExpansionModule,
    ClinicalTrialsModule.forRoot(),
    MatTabsModule,
    ApplicationsModule,
    ProductModule
  ],
  declarations: [
    SubstanceCountsComponent
    // FacetFilterPipe,
    // FacetDisplayPipe
  ],
  exports: [],
  entryComponents: [
    SubstanceCountsComponent
  ],
  providers: [
    SsoRefreshService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_sso_refresh_service,
      deps: [SsoRefreshService],
      multi: true
    }
  ]
})
export class FdaModule {
  constructor(
    router: Router
  ) {
    fdaRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FdaModule,
      providers: [
        ProductService,
        GeneralService
      ]
    };
  }
}
