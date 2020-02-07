import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { ClinicalTrialsBrowseComponent } from './clinical-trials-browse/clinical-trials-browse.component';
import { ClinicalTrialEditComponent } from './clinical-trial-edit/clinical-trial-edit.component';
import { ClinicalTrialAddComponent } from './clinical-trial-add/clinical-trial-add.component';
import { MiniSearchComponent } from './mini-search/mini-search.component';
import { ClinicalTrialService } from './clinical-trial/clinical-trial.service';
import { FacetDisplayPipe } from '../utils/facet-display.pipe';
import { FacetFilterPipe } from '../utils/facet-filter.pipe';



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
    MatSidenavModule,
    MatExpansionModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    CommonModule,
    RouterModule.forChild(clinicalTrialsRoutes)
  ],
  declarations: [
    ClinicalTrialsBrowseComponent,
    ClinicalTrialEditComponent,
    ClinicalTrialAddComponent,
    MiniSearchComponent,
    FacetFilterPipe,
    FacetDisplayPipe
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
