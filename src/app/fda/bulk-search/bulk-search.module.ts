import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BulkSearchService } from './service/bulk-search.service';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FacetsManagerModule } from '@gsrs-core/facets-manager';
import { SubstanceSearchSelectorModule } from '../substance-search-select/substance-search-selector.module';
import { SubstanceFormModule } from '../../core/substance-form/substance-form.module';
import { BulkSearchComponent } from '../bulk-search/bulk-search.component';
import { BulkQueryComponent } from '../bulk-search/bulk-query.component';

import { NameResolverModule } from '@gsrs-core/name-resolver/name-resolver.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { StructureModule } from '@gsrs-core/structure/structure.module';
import { TextInputFormComponent } from '@gsrs-core/utils/text-input-form/text-input-form.component';
import { FileUploadFormComponent } from '../bulk-search/file-upload-form/file-upload-form.component';

const bulkSearchRoutes: Routes = [
  {
    path: 'bulk-search',
    component: BulkQueryComponent
  },
  {
    path: 'bulk-search-results',
    component: BulkSearchComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(bulkSearchRoutes),
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
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    SubstanceSearchSelectorModule,
    SubstanceFormModule,
    FacetsManagerModule,
    NameResolverModule,
    StructureModule
  ],
  declarations: [
    BulkQueryComponent,
    BulkSearchComponent,
    TextInputFormComponent,
    FileUploadFormComponent
  ],
  exports: [
    BulkQueryComponent,
    BulkSearchComponent,
    TextInputFormComponent,
    FileUploadFormComponent
  ]
})

export class BulkSearchModule {
  constructor(router: Router) {
    bulkSearchRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: BulkSearchModule,
      providers: [
        BulkSearchService
      ]
    };
  }

}


