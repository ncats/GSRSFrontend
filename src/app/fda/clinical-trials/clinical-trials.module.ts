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
import { MatTabsModule } from '@angular/material/tabs';
import { ClinicalTrialsBrowseComponent } from './clinical-trials-browse/clinical-trials-browse.component';
import { ClinicalTrialEditComponent } from './clinical-trial-edit/clinical-trial-edit.component';
import { ClinicalTrialAddComponent } from './clinical-trial-add/clinical-trial-add.component';
import { MiniSearchComponent } from './mini-search/mini-search.component';
import { ClinicalTrialService } from './clinical-trial/clinical-trial.service';
import { ClinicalTrialDetailsBaseComponent } from './clinical-trial-details/clinical-trial-details-base.component';
import { ClinicalTrialDetailsComponent } from './clinical-trial-details/clinical-trial-details/clinical-trial-details.component';
// tslint:disable-next-line: max-line-length
import { ClinicalTrialEuropeDetailsComponent } from './clinical-trial-details/clinical-trial-europe-details/clinical-trial-europe-details.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { FacetsManagerModule } from '@gsrs-core/facets-manager';

const clinicalTrialsRoutes: Routes = [
   {
    path: 'browse-clinical-trials',
      component: ClinicalTrialsBrowseComponent
    },
   {
    path: 'edit-clinical-trial/:trialNumber',
      component: ClinicalTrialEditComponent
    },
    {
    path: 'add-clinical-trial',
      component: ClinicalTrialAddComponent
    },
    {
    path: 'clinicalTrialDetails/:trialNumber/:src',
      component: ClinicalTrialDetailsComponent
    },
    {
    path: 'clinicalTrialEuropeDetails/:trialNumber/:src',
      component: ClinicalTrialEuropeDetailsComponent
    }
];
// abcd
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
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    CommonModule,
    RouterModule.forChild(clinicalTrialsRoutes),
    MatProgressBarModule,
    SubstanceImageModule,
    FacetsManagerModule
  ],
  declarations: [
    MiniSearchComponent,
    ClinicalTrialsBrowseComponent,
    ClinicalTrialEditComponent,
    ClinicalTrialAddComponent,
    ClinicalTrialDetailsComponent,
    ClinicalTrialEuropeDetailsComponent,
    ClinicalTrialDetailsBaseComponent
  ],
  exports: [
    MiniSearchComponent,
    ClinicalTrialsBrowseComponent,
    ClinicalTrialEditComponent,
    ClinicalTrialAddComponent
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
