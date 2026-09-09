import { Routes } from "@angular/router";
import { InvitroPharmacologyAssaysetFormComponent } from "./invitro-pharmacology-form/invitro-pharmacology-assayset-form/invitro-pharmacology-assayset-form.component";
import { InvitroPharmacologyBrowseComponent } from "./invitro-pharmacology-browse/invitro-pharmacology-browse.component";
import { InvitroPharmacologyAssayFormComponent } from "./invitro-pharmacology-form/invitro-pharmacology-assay-form/invitro-pharmacology-assay-form.component";
import { ActivateInvitroPharmacologyComponent } from "./activate-invitro-pharmacology.component";
import { CanActivateRegisterInvitroPharmacologyFormComponent } from "./invitro-pharmacology-form/can-activate-register-invitro-pharmacology-form.component";
import { CanDeactivateInvitroAssayFormComponent } from "./invitro-pharmacology-form/can-deactivate-invitro-assay-form.component";
import { InvitroPharmacologyFormComponent } from "./invitro-pharmacology-form/invitro-pharmacology-form.component";
import { CanDeactivateInvitroScreeningFormComponent } from "./invitro-pharmacology-form/can-deactivate-invitro-screening-form.component";
import { CanActivateUpdateInvitroPharmacologyFormComponent } from "./invitro-pharmacology-form/can-activate-update-invitro-pharmacology-form.component";
import { InvitroPharmacologySummaryFormComponent } from "./invitro-pharmacology-form/invitro-pharmacology-summary-form/invitro-pharmacology-summary-form.component";
import { CanDeactivateInvitroSummaryFormComponent } from "./invitro-pharmacology-form/can-deactivate-invitro-summary-form.component";
import { InvitroPharmacologyDetailsComponent } from "./invitro-pharmacology-details/invitro-pharmacology-details.component";
import { InvitroPharmacologyDetailsTestagentComponent } from "./invitro-pharmacology-details/invitro-pharmacology-details-testagent/invitro-pharmacology-details-testagent.component";
import { InvitroPharmacologyAssayDataImportComponent } from "./invitro-pharmacology-assay-data-import/invitro-pharmacology-assay-data-import.component";
import { InvitroPharmacologyScreeningDataImportComponent } from "./invitro-pharmacology-screening-data-import/invitro-pharmacology-screening-data-import.component";

export const INVITRO_PHARMACOLOGY_ROUTES: Routes = [
    {
        path: 'invitro-pharm/assaySetBuilder',
        component: InvitroPharmacologyAssaysetFormComponent
      },
      {
        path: 'browse-invitro-pharm',
        component: InvitroPharmacologyBrowseComponent,
        //canActivate: [ActivateProductsComponent]
      },
      {
        path: 'invitro-pharm/assay/register',
        component: InvitroPharmacologyAssayFormComponent,
        canActivate: [ActivateInvitroPharmacologyComponent, CanActivateRegisterInvitroPharmacologyFormComponent],
        canDeactivate: [CanDeactivateInvitroAssayFormComponent]
      },
      {
        path: 'invitro-pharm/assay/:id/edit',
        component: InvitroPharmacologyAssayFormComponent,
        canActivate: [ActivateInvitroPharmacologyComponent, CanActivateRegisterInvitroPharmacologyFormComponent],
        canDeactivate: [CanDeactivateInvitroAssayFormComponent]
      },
      {
        path: 'invitro-pharm/assay/:id',
        component: InvitroPharmacologyAssayFormComponent
      },
      {
        path: 'invitro-pharm/register',
        component: InvitroPharmacologyFormComponent,
        canActivate: [ActivateInvitroPharmacologyComponent, CanActivateRegisterInvitroPharmacologyFormComponent],
        canDeactivate: [CanDeactivateInvitroScreeningFormComponent]
      },
      {
        path: 'invitro-pharm/:id/edit',
        component: InvitroPharmacologyFormComponent,
        canActivate: [ActivateInvitroPharmacologyComponent, CanActivateUpdateInvitroPharmacologyFormComponent],
        canDeactivate: [CanDeactivateInvitroScreeningFormComponent]
      },
      {
        path: 'invitro-pharm/summary/register',
        component: InvitroPharmacologySummaryFormComponent,
        canActivate: [ActivateInvitroPharmacologyComponent, CanActivateRegisterInvitroPharmacologyFormComponent],
        canDeactivate: [CanDeactivateInvitroSummaryFormComponent]
      },
      {
        path: 'invitro-pharm/summary/:id/edit',
        component: InvitroPharmacologySummaryFormComponent,
        canActivate: [ActivateInvitroPharmacologyComponent, CanActivateUpdateInvitroPharmacologyFormComponent],
        canDeactivate: [CanDeactivateInvitroSummaryFormComponent]
      },
      {
        path: 'invitro-pharm/import/assay',
        component: InvitroPharmacologyAssayDataImportComponent
      },
      {
        path: 'invitro-pharm/import/screening',
        component: InvitroPharmacologyScreeningDataImportComponent
      },
      {
        path: 'invitro-pharm/:id',
        component: InvitroPharmacologyDetailsComponent
      },
      {
        path: 'invitro-pharm',
        component: InvitroPharmacologyDetailsTestagentComponent
      }
]
