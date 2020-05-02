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
import { ApplicationsBrowseComponent } from './applications-browse/applications-browse.component';
import { ApplicationDetailsComponent } from './application-details/application-details/application-details.component';
import { ApplicationDarrtsDetailsComponent } from './application-details/application-darrts-details/application-darrts-details.component';
import { ApplicationDetailsBaseComponent } from './application-details/application-details-base.component';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { ApplicationProductFormComponent } from '../application/application-form/application-product-form/application-product-form.component';
import { IngredientFormComponent } from './application-form/ingredient-form/ingredient-form.component';
// import { JsonDialogFdaComponent } from '../json-dialog-fda/json-dialog-fda.component';
// import { ConfirmDialogComponent } from './application-form/confirm-dialog/confirm-dialog.component';
import { ApplicationService } from './service/application.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SubstanceSearchSelectorModule } from '../substance-search-select/substance-search-selector.module';
import { FacetsManagerModule } from '@gsrs-core/facets-manager';
import { JsonDialogFdaModule } from '../json-dialog-fda/json-dialog-fda.module';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';

const applicationRoutes: Routes = [
  {
    path: 'browse-applications',
    component: ApplicationsBrowseComponent
  },
  {
    path: 'applicationDetails/:id',
    component: ApplicationDetailsComponent
  },
  {
    path: 'applicationDarrtsDetails/:appType/:appNumber',
    component: ApplicationDarrtsDetailsComponent
  },
  {
    path: 'application/register',
    component: ApplicationFormComponent
  },
  {
    path: 'application/:id/edit',
    component: ApplicationFormComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(applicationRoutes),
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
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    MatProgressBarModule,
    SubstanceImageModule,
    SubstanceSearchSelectorModule,
    FacetsManagerModule,
    JsonDialogFdaModule,
    ConfirmDialogModule
  ],
  declarations: [
    ApplicationsBrowseComponent,
    ApplicationDetailsComponent,
    ApplicationDarrtsDetailsComponent,
    ApplicationDetailsBaseComponent,
    ApplicationFormComponent,
    ApplicationProductFormComponent,
    IngredientFormComponent,
//    JsonDialogFdaComponent,
//    ConfirmDialogComponent
  ],
  exports: [
    ApplicationsBrowseComponent,
 //   JsonDialogFdaComponent,
//    ConfirmDialogComponent
  ],
  entryComponents: [
 //   JsonDialogFdaComponent,
//    ConfirmDialogComponent
  ]
})

export class ApplicationModule {
  constructor(router: Router) {
    applicationRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ApplicationModule,
      providers: [
        ApplicationService
      ]
    };
  }

}

