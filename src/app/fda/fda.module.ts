import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader';
// tslint:disable-next-line:max-line-length
import { fdaLazyLoadedComponentManifests, fdaDynamicSubSummaryComponentManifests, fdaDynamicBrowseComponentManifests } from './fda-dynamic-componet-manifests';
import { SubstanceCardsModule } from '@gsrs-core/substance-details';
import { ApplicationModule} from './application/application.module';
import { SubstanceApplicationMatchListModule } from './substance-browse/substance-application-match-list/substance-application-match-list.module';
import { ProductModule} from './product/product.module';
import { ClinicalTrialsModule } from './clinical-trials/clinical-trials.module';
import { UserManualModule } from './user-manual/user-manual.module';
import { JiraSubmitTicketModule } from './jira-submit-ticket/jira-submit-ticket.module';
import { SubstanceCountsComponent } from './substance-browse/substance-counts/substance-counts.component';
import { SubstanceApplicationMatchListComponent} from './substance-browse/substance-application-match-list/substance-application-match-list.component';
import { ApplicationsBrowseComponent } from './application/applications-browse/applications-browse.component';
import { ClinicalTrialsBrowseComponent } from './clinical-trials/clinical-trials-browse/clinical-trials-browse.component';
import { fdaSubstanceCardsFilters } from './substance-details/fda-substance-cards-filters.constant';
import { SsoRefreshService } from './service/sso-refresh.service';
import { ProductService } from './product/service/product.service';
import { GeneralService} from './service/general.service';
import { ShowApplicationToggleComponent } from './substance-browse/show-application-toggle/show-application-toggle.component';
import { JiraSubmitTicketComponent } from './jira-submit-ticket/jira-submit-ticket.component';
import { UserManualComponent } from './user-manual/user-manual.component';
import { ImpuritiesModule } from './impurities/impurities.module';

const fdaRoutes: Routes = [
  {
    path: 'browse-clinical-trial',
    component: ClinicalTrialsBrowseComponent
  },
  {
    path: 'sub-app-match-list/:id',
    component: SubstanceApplicationMatchListComponent
  },
  {
    path: 'user-manual',
    component: UserManualComponent
  },
  {
    path: 'jira-submit',
    component: JiraSubmitTicketComponent
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
    ImpuritiesModule,
    SubstanceApplicationMatchListModule,
    UserManualModule,
    JiraSubmitTicketModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatBadgeModule,
    MatCheckboxModule
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
