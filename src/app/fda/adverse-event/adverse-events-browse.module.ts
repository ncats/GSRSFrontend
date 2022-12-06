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
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SubstanceSearchSelectorModule } from '../substance-search-select/substance-search-selector.module';
import { FacetsManagerModule } from '@gsrs-core/facets-manager';
import { SubstanceFormModule } from '../../core/substance-form/substance-form.module';
import { AdverseEventTextSearchModule } from './adverse-event-text-search/adverse-event-text-search.module';
import { AdverseEventService } from './service/adverseevent.service';
import { AdverseEventsPtBrowseComponent } from './adverse-events-pt-browse/adverse-events-pt-browse.component';
import { AdverseEventsDmeBrowseComponent } from './adverse-events-dme-browse/adverse-events-dme-browse.component';
import { AdverseEventsCvmBrowseComponent } from './adverse-events-cvm-browse/adverse-events-cvm-browse.component';
import { AdverseEventsBrowseComponent } from './adverse-events-browse/adverse-events-browse.component';
import { ActivateAdverseeventsComponent } from './activate-adverse-events.component';

const advEventRoutes: Routes = [
  {
    path: 'browse-adverse-events',
    component: AdverseEventsBrowseComponent,
    canActivate: [ActivateAdverseeventsComponent]
  },
  {
    path: 'adverse-event-pt-browse',
    component: AdverseEventsPtBrowseComponent,
    canActivate: [ActivateAdverseeventsComponent]
  },
  {
    path: 'adverse-event-dme-browse',
    component: AdverseEventsDmeBrowseComponent,
    canActivate: [ActivateAdverseeventsComponent]
  },
  {
    path: 'adverse-event-cvm-browse',
    component: AdverseEventsCvmBrowseComponent,
    canActivate: [ActivateAdverseeventsComponent]
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
   // MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    SubstanceSearchSelectorModule,
    SubstanceFormModule,
    FacetsManagerModule,
    AdverseEventTextSearchModule
  ],
  declarations: [
    AdverseEventsPtBrowseComponent,
    AdverseEventsDmeBrowseComponent,
    AdverseEventsCvmBrowseComponent,
    AdverseEventsBrowseComponent,
    AdverseEventsBrowseComponent
  ],
  exports: [
  ],
  providers: [
    ActivateAdverseeventsComponent
  ]
})

export class AdverseEventsBrowseModule {
  constructor(router: Router) {
    advEventRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: AdverseEventsBrowseModule,
      providers: [
        AdverseEventService,
        ActivateAdverseeventsComponent
      ]
    };
  }
}
