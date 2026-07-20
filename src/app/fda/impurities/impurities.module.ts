import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OverlayModule } from '@angular/cdk/overlay';

/* GSRS Core Imports */
import { SubstanceFormModule } from '../../core/substance-form/substance-form.module';
import { SubstanceSelectorModule } from '../../core/substance-selector/substance-selector.module';
import { SubstanceSearchSelectorModule } from '../substance-search-select/substance-search-selector.module';
import { SubstanceTextSearchModule } from '@gsrs-core/substance-text-search/substance-text-search.module';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { FacetsManagerModule } from '@gsrs-core/facets-manager';

/* GSRS Impurities Imports */
import { ImpuritiesTextSearchModule } from './impurities-text-search/impurities-text-search.module';
import { CanActivateRegisterImpuritiesFormComponent } from './impurities-form/can-activate-register-impurities-form.component';
import { CanActivateUpdateImpuritiesFormComponent } from './impurities-form/can-activate-update-impurities-form.component';
import { CanDeactivateImpuritiesFormComponent } from './impurities-form/can-deactivate-impurities-form.component';
import { ActivateImpuritiesComponent } from './activate-impurities.component';
import { ImpuritiesFormComponent } from '../impurities/impurities-form/impurities-form.component';
import { ImpuritiesSubstanceFormComponent } from './impurities-form/impurities-substance-form/impurities-substance-form.component';
import { ImpuritiesTestFormComponent } from './impurities-form/impurities-test-form/impurities-test-form.component';
import { ImpuritiesDetailsFormComponent } from '../impurities/impurities-form/impurities-details-form/impurities-details-form.component';
import { ImpuritiesUnspecifiedFormComponent } from './impurities-form/impurities-unspecified-form/impurities-unspecified-form.component';
import { ImpuritiesResidualSolventsTestComponent } from './impurities-form/impurities-residual-solvents-test-form/impurities-residual-solvents-test.component';
import { ImpuritiesResidualSolventsFormComponent } from './impurities-form/impurities-residual-solvents-form/impurities-residual-solvents-form.component';
import { ImpuritiesInorganicFormTestComponent } from './impurities-form/impurities-inorganic-test-form/impurities-inorganic-form-test.component';
import { ImpuritiesInorganicFormComponent } from './impurities-form/impurities-inorganic-form/impurities-inorganic-form.component';
import { ImpuritiesTotalFormComponent } from './impurities-form/impurities-total-form/impurities-total-form.component';
import { ImpuritiesImportComponent } from './impurities-import/impurities-import.component';
import { ImpuritiesDetailsComponent } from './impurities-details/impurities-details.component';
import { ImpuritiesBrowseComponent } from './impurities-browse/impurities-browse.component';
import { ImpuritiesListsComponent } from './impurities-lists/impurities-lists.component';

const impurityRoutes: Routes = [
  {
    path: 'browse-impurities',
    component: ImpuritiesBrowseComponent
  },
  {
    path: 'impurities/lists',
    component: ImpuritiesListsComponent,
  },
  {
    path: 'impurities/import',
    component: ImpuritiesImportComponent
  },
  {
    path: 'impurities/register',
    component: ImpuritiesFormComponent,
    canActivate: [ActivateImpuritiesComponent, CanActivateRegisterImpuritiesFormComponent],
    canDeactivate: [CanDeactivateImpuritiesFormComponent]
  },
  {
    path: 'impurities/:id/edit',
    component: ImpuritiesFormComponent,
    canActivate: [ActivateImpuritiesComponent, CanActivateUpdateImpuritiesFormComponent],
    canDeactivate: [CanDeactivateImpuritiesFormComponent]
  },
  {
    path: 'impurities/:id',
    component: ImpuritiesDetailsComponent,
    canActivate: [ActivateImpuritiesComponent]
  },
  {
    path: 'impurities',
    component: ImpuritiesDetailsComponent,
    canActivate: [ActivateImpuritiesComponent]
  }
];

@NgModule({
  declarations: [
    ImpuritiesFormComponent,
    ImpuritiesSubstanceFormComponent,
    ImpuritiesTestFormComponent,
    ImpuritiesDetailsFormComponent,
    ImpuritiesUnspecifiedFormComponent,
    ImpuritiesResidualSolventsTestComponent,
    ImpuritiesResidualSolventsFormComponent,
    ImpuritiesInorganicFormTestComponent,
    ImpuritiesInorganicFormComponent,
    ImpuritiesTotalFormComponent,
    ImpuritiesImportComponent,
    ImpuritiesDetailsComponent,
    ImpuritiesBrowseComponent,
    ImpuritiesListsComponent
  ],
  exports: [
    ImpuritiesImportComponent
  ],
  imports: [
    RouterModule.forChild(impurityRoutes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatBadgeModule,
    MatExpansionModule,
    MatSidenavModule,
    MatTableModule,
    MatTabsModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatSliderModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatTooltipModule, 
    MatProgressSpinnerModule, 
    MatBottomSheetModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    OverlayModule,
    SubstanceFormModule,
    SubstanceTextSearchModule,
    SubstanceSearchSelectorModule,
    SubstanceSelectorModule,
    SubstanceImageModule,
    FacetsManagerModule,
    ImpuritiesTextSearchModule
  ],
  providers: [
    CanActivateRegisterImpuritiesFormComponent,
    CanActivateUpdateImpuritiesFormComponent,
    CanDeactivateImpuritiesFormComponent,
    ActivateImpuritiesComponent
  ]
})

export class ImpuritiesModule {
  constructor(router: Router) {
    impurityRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: ImpuritiesModule,
      providers: [
        CanActivateRegisterImpuritiesFormComponent,
        CanActivateUpdateImpuritiesFormComponent,
        CanDeactivateImpuritiesFormComponent,
        ActivateImpuritiesComponent
      ]
    };
  }

}