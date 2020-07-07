import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader';
// tslint:disable-next-line:max-line-length
import { fdaLazyLoadedComponentManifests, fdaDynamicSubSummaryComponentManifests, fdaDynamicBrowseComponentManifests } from './fda-dynamic-componet-manifests';
import { SubstanceCardsModule } from '@gsrs-core/substance-details';
import { fdaSubstanceCardsFilters } from './substance-details/fda-substance-cards-filters.constant';
import { ProductService } from './product/service/product.service';
import { MatCardModule } from '@angular/material/card';
import { ClinicalTrialsModule } from './clinical-trials/clinical-trials.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { SubstanceCountsComponent } from './substance-browse/substance-counts/substance-counts.component';
import { ApplicationModule} from './application/application.module';
import { ProductModule} from './product/product.module';
import { GeneralService} from './service/general.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClinicalTrialsBrowseComponent } from './clinical-trials/clinical-trials-browse/clinical-trials-browse.component';
import { SsoRefreshService } from './service/sso-refresh.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShowApplicationToggleComponent } from './substance-browse/show-application-toggle/show-application-toggle.component';

const fdaRoutes: Routes = [
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
    DynamicComponentLoaderModule.forRoot(fdaLazyLoadedComponentManifests, fdaDynamicBrowseComponentManifests),
    SubstanceCardsModule.forRoot(fdaSubstanceCardsFilters),
    ClinicalTrialsModule.forRoot(),
    ApplicationModule,
    ProductModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    SubstanceCountsComponent,
    ShowApplicationToggleComponent
  ],
  exports: [],
  entryComponents: [
    SubstanceCountsComponent,
    ShowApplicationToggleComponent

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
