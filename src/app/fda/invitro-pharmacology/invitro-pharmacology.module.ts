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
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

/* GSRS Core Imports */
import { FacetsManagerModule } from '@gsrs-core/facets-manager';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SubstanceTextSearchModule } from '@gsrs-core/substance-text-search/substance-text-search.module';
import { SubstanceFormModule } from '@gsrs-core/substance-form/substance-form.module';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyComponent } from './invitro-pharmacology.component';
import { InvitroPharmacologyDetailsComponent } from './invitro-pharmacology-details/invitro-pharmacology-details.component';
import { InvitroPharmacologyBrowseComponent } from './invitro-pharmacology-browse/invitro-pharmacology-browse.component';
import { InvitroPharmacologyFormComponent } from './invitro-pharmacology-form/invitro-pharmacology-form.component';
import { InvitroPharmacologyTextSearchComponent } from './invitro-pharmacology-text-search/invitro-pharmacology-text-search.component';
import { InvitroPharmacologyDataImportComponent } from './invitro-pharmacology-data-import/invitro-pharmacology-data-import.component';
import { InvitroPharmacologyDetailsTestagentComponent } from './invitro-pharmacology-details/invitro-pharmacology-details-testagent/invitro-pharmacology-details-testagent.component';
import { InvitroPharmacologyAssayFormComponent } from './invitro-pharmacology-form/invitro-pharmacology-assay-form/invitro-pharmacology-assay-form.component';

const invitroRoutes: Routes = [
  {
    path: 'browse-invitro-pharm',
    component: InvitroPharmacologyBrowseComponent,
    //canActivate: [ActivateProductsComponent]
  },
  {
    path: 'invitro-pharm/assay/register',
    component: InvitroPharmacologyAssayFormComponent
  },
  {
    path: 'invitro-pharm/assay/:id/edit',
    component: InvitroPharmacologyAssayFormComponent
  },
  {
    path: 'invitro-pharm/assay/:id',
    component: InvitroPharmacologyAssayFormComponent
  },
  {
    path: 'invitro-pharm/register',
    component: InvitroPharmacologyFormComponent
  },
  {
    path: 'invitro-pharm/:id/edit',
    component: InvitroPharmacologyFormComponent,
    //canActivate: [ActivateImpuritiesComponent, CanActivateUpdateImpuritiesFormComponent],
    //canDeactivate: [CanDeactivateImpuritiesFormComponent]
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
    path: 'import-invitro-pharm',
    component: InvitroPharmacologyDataImportComponent
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
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    FacetsManagerModule,
    SubstanceImageModule,
    SubstanceTextSearchModule,
    SubstanceFormModule
  ],
  declarations: [
    InvitroPharmacologyComponent,
    InvitroPharmacologyDetailsComponent,
    InvitroPharmacologyBrowseComponent,
    InvitroPharmacologyFormComponent,
    InvitroPharmacologyTextSearchComponent,
    InvitroPharmacologyDataImportComponent,
    InvitroPharmacologyDetailsTestagentComponent,
    InvitroPharmacologyAssayFormComponent
  ],
  exports: [
  ],
  providers: [
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
      ]
    };
  }

}
