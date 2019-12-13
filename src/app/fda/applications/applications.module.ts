import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ApplicationsBrowseComponent } from './applications-browse/applications-browse.component';
import { ApplicationService } from './service/application.service';

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
import { OverlayModule } from '@angular/cdk/overlay';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

const applicationRoutes: Routes = [
  {
    path: 'browse-applications',
    component: ApplicationsBrowseComponent
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
    OverlayModule
  ],
  declarations: [ApplicationsBrowseComponent],
  exports: [
    ApplicationsBrowseComponent
  ]
})

export class ApplicationsModule { 
  constructor(router: Router) {
    applicationRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

static forRoot(): ModuleWithProviders {
  return {
    ngModule: ApplicationsModule,
    providers: [
      ApplicationService
    ]
  };
}

}

