import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { SubstanceFormModule } from '../../core/substance-form/substance-form.module';
import { SubstanceSearchSelectorModule } from '../substance-search-select/substance-search-selector.module';
import { SubstanceTextSearchModule } from '@gsrs-core/substance-text-search/substance-text-search.module';
import { SubstanceSelectorModule } from '../../core/substance-selector/substance-selector.module';
import { ImpuritiesFormComponent } from '../impurities/impurities-form/impurities-form.component';
import { ImpuritiesDetailsFormComponent} from '../impurities/impurities-form/impurities-details-form/impurities-details-form.component';
import { ImpuritiesDetailsComponent } from './impurities-details/impurities-details.component';
import { ImpuritiesUnspecifiedFormComponent } from './impurities-form/impurities-unspecified-form/impurities-unspecified-form.component';
import { ImpuritiesTotalFormComponent } from './impurities-form/impurities-total-form/impurities-total-form.component';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { ImpuritiesTestFormComponent } from './impurities-form/impurities-test-form/impurities-test-form.component';
import { ImpuritiesSubstanceFormComponent } from './impurities-form/impurities-substance-form/impurities-substance-form.component';
import { ImpuritiesResidualSolventsFormComponent } from './impurities-form/impurities-residual-solvents-form/impurities-residual-solvents-form.component';
import { ImpuritiesInorganicFormComponent } from './impurities-form/impurities-inorganic-form/impurities-inorganic-form.component';
import { CanActivateRegisterImpuritiesFormComponent } from './impurities-form/can-activate-register-impurities-form.component';
import { CanActivateUpdateImpuritiesFormComponent } from './impurities-form/can-activate-update-impurities-form.component';
import { CanDeactivateImpuritiesFormComponent } from './impurities-form/can-deactivate-impurities-form.component';
import { ActivateImpuritiesComponent } from './activate-impurities.component';

const impurityRoutes: Routes = [
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
  }
];

@NgModule({
  declarations: [
    ImpuritiesFormComponent,
    ImpuritiesDetailsFormComponent,
    ImpuritiesDetailsComponent,
    ImpuritiesUnspecifiedFormComponent,
    ImpuritiesTotalFormComponent,
    ImpuritiesTestFormComponent,
    ImpuritiesSubstanceFormComponent,
    ImpuritiesResidualSolventsFormComponent,
    ImpuritiesInorganicFormComponent
  ],
  imports: [
    RouterModule.forChild(impurityRoutes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatBadgeModule,
    MatExpansionModule,
    SubstanceFormModule,
    SubstanceTextSearchModule,
    SubstanceSearchSelectorModule,
    SubstanceSelectorModule,
    SubstanceImageModule
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
