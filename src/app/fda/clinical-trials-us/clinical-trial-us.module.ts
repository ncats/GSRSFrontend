import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClinicalTrialUSService } from './service/clinical-trial-us.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ClinicalTrialUSDetailsBaseComponent } from './clinical-trial-us-details/clinical-trial-us-details-base.component';
import { ClinicalTrialUSDetailsComponent } from './clinical-trial-us-details/clinical-trial-us-details/clinical-trial-us-details.component';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { ClinicalTrialUSFormComponent } from './clinical-trial-us-form/clinical-trial-us-form.component';
import { ClinicalTrialUSSubstanceFormComponent } from './clinical-trial-us-form/clinical-trial-us-substance-form/clinical-trial-us-substance-form.component';
import { JsonDialogFdaComponent } from '../json-dialog-fda/json-dialog-fda.component';
import { SubstanceSearchSelectorModule } from '../substance-search-select/substance-search-selector.module';
import { SubstanceFormModule } from '../../core/substance-form/substance-form.module';
import { ClinicalTrialsUSBrowseComponent } from './clinical-trials-us-browse/clinical-trials-us-browse.component';
import { FacetsManagerModule } from '@gsrs-core/facets-manager';
import { CanActivateRegisterClinicalTrialUSFormComponent } from './clinical-trial-us-form/can-activate-register-clinical-trial-us-form.component';
import { CanActivateUpdateClinicalTrialUSFormComponent } from './clinical-trial-us-form/can-activate-update-clinical-trial-us-form.component';
import { CanDeactivateClinicalTrialUSFormComponent } from './clinical-trial-us-form/can-deactivate-clinical-trial-us-form.component';
import { ActivateClinicalTrialsUSComponent } from './activate-clinical-trials-us.component';
import { SubstanceListItemComponent } from './misc/substance-list-item/substance-list-item.component';
import { SubstanceOrgDisplayKeyComponent } from './misc/substance-org-display-key/substance-org-display-key.component';

const clinicalTrialUSRoutes: Routes = [
  {
    path: 'browse-clinical-trials-us',
    component: ClinicalTrialsUSBrowseComponent,
    canActivate: [ActivateClinicalTrialsUSComponent]
  },
  {
    path: 'clinical-trial-us/register',
    component: ClinicalTrialUSFormComponent,
    canActivate: [ActivateClinicalTrialsUSComponent, CanActivateRegisterClinicalTrialUSFormComponent],
    canDeactivate: [CanDeactivateClinicalTrialUSFormComponent]
  },
  {
    path: 'clinical-trial-us/:trialNumber/edit',
    component: ClinicalTrialUSFormComponent,
    canActivate: [ActivateClinicalTrialsUSComponent, CanActivateUpdateClinicalTrialUSFormComponent],
    canDeactivate: [CanDeactivateClinicalTrialUSFormComponent]
  },
  {
    path: 'clinical-trial-us/:trialNumber',
    component: ClinicalTrialUSDetailsComponent,
    canActivate: [ActivateClinicalTrialsUSComponent]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(clinicalTrialUSRoutes),
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSliderModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatTabsModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    SubstanceImageModule,
    SubstanceSearchSelectorModule,
    SubstanceFormModule,
    FacetsManagerModule
  ],
  declarations: [
    ClinicalTrialsUSBrowseComponent,
    ClinicalTrialUSDetailsBaseComponent,
    ClinicalTrialUSDetailsComponent,
    ClinicalTrialUSFormComponent,
    ClinicalTrialUSSubstanceFormComponent,
    SubstanceListItemComponent,
    SubstanceOrgDisplayKeyComponent
  ],
  exports: [
    ClinicalTrialsUSBrowseComponent,
    ClinicalTrialUSDetailsBaseComponent,
    ClinicalTrialUSDetailsComponent
  ],
  providers: [
    CanActivateRegisterClinicalTrialUSFormComponent,
    CanActivateUpdateClinicalTrialUSFormComponent,
    ActivateClinicalTrialsUSComponent
  ]
})

export class ClinicalTrialUSModule {
  constructor(router: Router) {
    clinicalTrialUSRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ClinicalTrialUSModule,
      providers: [
        ClinicalTrialUSService,
        CanActivateRegisterClinicalTrialUSFormComponent,
        CanActivateUpdateClinicalTrialUSFormComponent,
        CanDeactivateClinicalTrialUSFormComponent,
        ActivateClinicalTrialsUSComponent
      ]
    };
  }

}
