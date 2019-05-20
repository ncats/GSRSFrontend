import { NgModule } from '@angular/core';
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
import { MiniSearchComponent } from './mini-search/mini-search.component';


const clinicalTrialsRoutes: Routes = [
   {
    path: 'browse-clinical-trials',
      component: ClinicalTrialsBrowseComponent
    },
   {
    path: 'edit-clinical-trial/:nctNumber',
      component: ClinicalTrialEditComponent
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
    CommonModule,
    RouterModule.forChild(clinicalTrialsRoutes)
  ],
  declarations: [
    ClinicalTrialsBrowseComponent,
    ClinicalTrialEditComponent,
    MiniSearchComponent
  ],
  exports: [
    ClinicalTrialsBrowseComponent,
    ClinicalTrialEditComponent,
    MiniSearchComponent
  ]
})
export class ClinicalTrialsModule {
  constructor(router: Router) {
    clinicalTrialsRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }
 }
