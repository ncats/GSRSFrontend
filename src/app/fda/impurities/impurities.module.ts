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
import { SubstanceFormModule } from '../../core/substance-form/substance-form.module';
import { SubstanceSearchSelectorModule } from '../substance-search-select/substance-search-selector.module';
import { SubstanceTextSearchModule } from '@gsrs-core/substance-text-search/substance-text-search.module';
// import { SubstanceSelectorComponent } from '../../core/substance-selector/substance-selector.component';
import { SubstanceSelectorModule } from '../../core/substance-selector/substance-selector.module';
import { ImpuritiesFormComponent } from '../impurities/impurities-form/impurities-form.component';
import { ImpuritiesDetailsFormComponent} from '../impurities/impurities-form/impurities-details-form/impurities-details-form.component';
import { ImpuritiesViewComponent } from './impurities-view/impurities-view.component';
import { ImpuritiesUnspecifiedFormComponent } from './impurities-form/impurities-unspecified-form/impurities-unspecified-form.component';
import { ImpuritiesTotalFormComponent } from './impurities-form/impurities-total-form/impurities-total-form.component';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

const impurityRoutes: Routes = [
  {
    path: 'impurities/register',
    component: ImpuritiesFormComponent
  },
  {
    path: 'impurities/:id/edit',
    component: ImpuritiesFormComponent
  },
  {
    path: 'impurities/:id',
    component: ImpuritiesViewComponent
  }
];

@NgModule({
  declarations: [
    ImpuritiesFormComponent,
    ImpuritiesDetailsFormComponent,
    ImpuritiesViewComponent,
    ImpuritiesUnspecifiedFormComponent,
    ImpuritiesTotalFormComponent
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
    SubstanceFormModule,
    SubstanceTextSearchModule,
    SubstanceSearchSelectorModule,
    SubstanceSelectorModule,
    SubstanceImageModule
  ]
})

export class ImpuritiesModule { 
  constructor(router: Router) {
    impurityRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ImpuritiesModule,
      providers: [
      ]
    };
  }

}
