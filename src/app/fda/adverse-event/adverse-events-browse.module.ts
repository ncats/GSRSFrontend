import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
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
import { MatTabsModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
// import { JsonDialogFdaComponent } from '../json-dialog-fda/json-dialog-fda.component';
// import { ConfirmDialogComponent } from './application-form/confirm-dialog/confirm-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SubstanceSearchSelectorModule } from '../substance-search-select/substance-search-selector.module';
import { FacetsManagerModule } from '@gsrs-core/facets-manager';
// import { CvInputComponent } from '@gsrs-core/substance-form/cv-input/cv-input.component';
import { SubstanceFormModule } from '../../core/substance-form/substance-form.module';
import { AdverseEventService } from './service/adverseevent.service';
import { AdverseEventBrowseComponent } from './adverse-events-browse/adverse-event-browse.component';
import { AdverseEventsDmeBrowseComponent } from './adverse-event-dme-browse/adverse-events-dme-browse.component';
import { AdverseEventCvmBrowseComponent } from './adverse-event-cvm-browse/adverse-event-cvm-browse.component';

const advEventRoutes: Routes = [
  {
    path: 'adverse-event-browse',
    component: AdverseEventBrowseComponent
  },
  {
    path: 'adverse-event-dme-browse',
    component: AdverseEventsDmeBrowseComponent
  },
  {
    path: 'adverse-event-cvm-browse',
    component: AdverseEventCvmBrowseComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(advEventRoutes),
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
   // MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    SubstanceSearchSelectorModule,
    SubstanceFormModule,
    FacetsManagerModule
  ],
  declarations: [
    AdverseEventBrowseComponent,
    AdverseEventsDmeBrowseComponent,
    AdverseEventCvmBrowseComponent
  ],
  exports: [
  ]
})

export class AdverseEventsBrowseModule {
  constructor(router: Router) {
    advEventRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AdverseEventsBrowseModule,
      providers: [
        AdverseEventService
      ]
    };
  }
}
