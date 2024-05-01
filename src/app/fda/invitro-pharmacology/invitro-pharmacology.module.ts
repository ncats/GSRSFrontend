import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatStepperModule } from '@angular/material/stepper';

/* GSRS Core Imports */
import { FacetsManagerModule } from '@gsrs-core/facets-manager';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SubstanceTextSearchModule } from '@gsrs-core/substance-text-search/substance-text-search.module';
import { SubstanceFormModule } from '@gsrs-core/substance-form/substance-form.module';
import { SubstanceSelectorModule } from '../../core/substance-selector/substance-selector.module';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyComponent } from './invitro-pharmacology.component';
import { InvitroPharmacologyDetailsComponent } from './invitro-pharmacology-details/invitro-pharmacology-details.component';
import { InvitroPharmacologyBrowseComponent } from './invitro-pharmacology-browse/invitro-pharmacology-browse.component';
import { InvitroPharmacologyFormComponent } from './invitro-pharmacology-form/invitro-pharmacology-form.component';
import { InvitroPharmacologyTextSearchComponent } from './invitro-pharmacology-text-search/invitro-pharmacology-text-search.component';
import { InvitroPharmacologyAssayDataImportComponent } from './invitro-pharmacology-assay-data-import/invitro-pharmacology-assay-data-import.component';
import { InvitroPharmacologyDetailsTestagentComponent } from './invitro-pharmacology-details/invitro-pharmacology-details-testagent/invitro-pharmacology-details-testagent.component';
import { InvitroPharmacologyAssayFormComponent } from './invitro-pharmacology-form/invitro-pharmacology-assay-form/invitro-pharmacology-assay-form.component';
import { CanActivateRegisterInvitroPharmacologyFormComponent } from './invitro-pharmacology-form/can-activate-register-invitro-pharmacology-form.component';
import { CanActivateUpdateInvitroPharmacologyFormComponent } from './invitro-pharmacology-form/can-activate-update-invitro-pharmacology-form.component';
import { CanDeactivateInvitroScreeningFormComponent } from './invitro-pharmacology-form/can-deactivate-invitro-screening-form.component';
import { CanDeactivateInvitroAssayFormComponent } from './invitro-pharmacology-form/can-deactivate-invitro-assay-form.component';
import { CanDeactivateInvitroSummaryFormComponent } from './invitro-pharmacology-form/can-deactivate-invitro-summary-form.component';
import { ActivateInvitroPharmacologyComponent } from './activate-invitro-pharmacology.component';
import { InvitroPharmacologySummaryFormComponent } from './invitro-pharmacology-form/invitro-pharmacology-summary-form/invitro-pharmacology-summary-form.component';

const invitroRoutes: Routes = [
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
    path: 'invitro-pharm/:id',
    component: InvitroPharmacologyDetailsComponent
  },
  {
    path: 'invitro-pharm',
    component: InvitroPharmacologyDetailsTestagentComponent
  },
  {
    path: 'invitro-pharm/import/assay',
    component: InvitroPharmacologyAssayDataImportComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(invitroRoutes),
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
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSliderModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatTabsModule,
    MatRadioModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    FacetsManagerModule,
    SubstanceImageModule,
    SubstanceTextSearchModule,
    SubstanceFormModule,
    SubstanceSelectorModule
  ],
  declarations: [
    InvitroPharmacologyComponent,
    InvitroPharmacologyDetailsComponent,
    InvitroPharmacologyBrowseComponent,
    InvitroPharmacologyFormComponent,
    InvitroPharmacologyTextSearchComponent,
    InvitroPharmacologyAssayDataImportComponent,
    InvitroPharmacologyDetailsTestagentComponent,
    InvitroPharmacologyAssayFormComponent,
    InvitroPharmacologySummaryFormComponent
  ],
  exports: [
  ],
  providers: [
    CanActivateRegisterInvitroPharmacologyFormComponent,
    CanActivateUpdateInvitroPharmacologyFormComponent,
    CanDeactivateInvitroScreeningFormComponent,
    ActivateInvitroPharmacologyComponent
  ]
})

export class InvitroPharmaModule {
  constructor(router: Router) {
    invitroRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: InvitroPharmaModule,
      providers: [
        CanActivateRegisterInvitroPharmacologyFormComponent,
        CanActivateUpdateInvitroPharmacologyFormComponent,
        CanDeactivateInvitroScreeningFormComponent,
        ActivateInvitroPharmacologyComponent
      ]
    };
  }

}
