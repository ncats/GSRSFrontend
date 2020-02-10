import { NgModule, ModuleWithProviders } from '@angular/core';
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
import { SubstanceCountsComponent } from './substance-browse/substance-counts/substance-counts.component';
import { ApplicationsModule} from './applications/applications.module';
import { ProductModule} from './product/product.module';
import { GeneralService} from './service/general.service';
import { MatTabsModule } from '@angular/material/tabs';

import { ApplicationsBrowseComponent } from './applications/applications-browse/applications-browse.component';
import { ClinicalTrialsBrowseComponent } from './clinical-trials/clinical-trials-browse/clinical-trials-browse.component';

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

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(fdaRoutes),
    DynamicComponentLoaderModule.forRoot(fdaLazyLoadedComponentManifests, fdaDynamicSubSummaryComponentManifests),
    SubstanceCardsModule.forRoot(fdaSubstanceCardsFilters),
    MatCardModule,
    MatTabsModule,
    ClinicalTrialsModule.forRoot(),
    ApplicationsModule,
    ProductModule
  ],
  declarations: [
    SubstanceCountsComponent,
  ],
  exports: [],
  entryComponents: [
    SubstanceCountsComponent
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
