import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ClinicalTrialsBrowseComponent } from './clinical-trials-browse/clinical-trials-browse.component';
import { ClinicalTrialEditComponent } from './clinical-trial-edit/clinical-trial-edit.component';
import { ClinicalTrialAddComponent } from './clinical-trial-add/clinical-trial-add.component';
import { MiniSearchComponent } from './mini-search/mini-search.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { pipes2Br } from './filters/pipes-2-br';
import { ClinicalTrialService } from './clinical-trial/clinical-trial.service';
import { ClinicalTrialDetailsBaseComponent } from './clinical-trial-details/clinical-trial-details-base.component';
import { ClinicalTrialDetailsComponent } from './clinical-trial-details/clinical-trial-details/clinical-trial-details.component';
// tslint:disable-next-line: max-line-length
import { ClinicalTrialEuropeDetailsComponent } from './clinical-trial-details/clinical-trial-europe-details/clinical-trial-europe-details.component';

const clinicalTrialsRoutes: Routes = [
   {
    path: 'browse-clinical-trials',
      component: ClinicalTrialsBrowseComponent
    },
   {
    path: 'edit-clinical-trial/:nctNumber',
      component: ClinicalTrialEditComponent
    },
    {
    path: 'add-clinical-trial',
      component: ClinicalTrialAddComponent
    },
    {
    path: 'clinicalTrialDetails/:nctNumber',
      component: ClinicalTrialDetailsComponent
    },
    {
    path: 'clinicalTrialEuropeDetails/:nctNumber',
      component: ClinicalTrialEuropeDetailsComponent
    }
];

@NgModule({
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    CommonModule,
    RouterModule.forChild(clinicalTrialsRoutes)
  ],
  declarations: [
    ClinicalTrialsBrowseComponent,
    ClinicalTrialEditComponent,
    ClinicalTrialAddComponent,
    MiniSearchComponent,
    pipes2Br,
    ClinicalTrialDetailsComponent,
    ClinicalTrialEuropeDetailsComponent,
    ClinicalTrialDetailsBaseComponent
  ],
  exports: [
    ClinicalTrialsBrowseComponent,
    ClinicalTrialEditComponent,
    ClinicalTrialAddComponent,
    MiniSearchComponent
  ]
})
export class ClinicalTrialsModule {
  constructor(router: Router) {
    clinicalTrialsRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ClinicalTrialsModule,
      providers: [
        ClinicalTrialService
      ]
    };
  }
 }
