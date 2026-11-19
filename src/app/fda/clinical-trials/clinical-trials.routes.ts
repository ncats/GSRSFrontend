import { Routes } from "@angular/router";
import { ClinicalTrialsBrowseComponent } from "./clinical-trials-browse/clinical-trials-browse.component";
import { ActivateClinicalTrialsComponent } from "./activate-clinical-trials.component";
import { ClinicalTrialEditComponent } from "./clinical-trial-edit/clinical-trial-edit.component";
import { ClinicalTrialAddComponent } from "./clinical-trial-add/clinical-trial-add.component";
import { ClinicalTrialDetailsComponent } from "./clinical-trial-details/clinical-trial-details/clinical-trial-details.component";
import { ClinicalTrialEuropeDetailsComponent } from "./clinical-trial-details/clinical-trial-europe-details/clinical-trial-europe-details.component";

export const CLINICAL_TRIALS_ROUTES: Routes = [
    {
    path: 'browse-clinical-trials',
      component: ClinicalTrialsBrowseComponent,
      canActivate: [ActivateClinicalTrialsComponent]

    },
    {
    path: 'edit-clinical-trial/:trialNumber',
      component: ClinicalTrialEditComponent,
      canActivate: [ActivateClinicalTrialsComponent]
    },
    {
    path: 'add-clinical-trial',
      component: ClinicalTrialAddComponent,
      canActivate: [ActivateClinicalTrialsComponent]

    },
    {
    path: 'clinical-trial/:trialNumber',
      component: ClinicalTrialDetailsComponent,
      canActivate: [ActivateClinicalTrialsComponent]
    },
    {
    path: 'clinicalTrialEuropeDetails/:trialNumber/:src',
      component: ClinicalTrialEuropeDetailsComponent,
      canActivate: [ActivateClinicalTrialsComponent]
    }
]