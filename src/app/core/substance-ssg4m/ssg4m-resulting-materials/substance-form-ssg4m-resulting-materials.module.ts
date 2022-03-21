import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxJsonViewerModule} from 'ngx-json-viewer';
// GSRS Imports
import { FileSelectModule } from 'file-select';
import { ScrollToModule } from '@gsrs-core/scroll-to/scroll-to.module';
import { ExpandDetailsModule } from '@gsrs-core/expand-details/expand-details.module';
import { SubstanceSelectorModule } from '@gsrs-core/substance-selector/substance-selector.module';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SubstanceFormModule } from '@gsrs-core/substance-form/substance-form.module';
import { Ssg4mResultingMaterialsFormComponent } from './ssg4m-resulting-materials-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatDividerModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    ScrollToModule,
    MatDialogModule,
    MatTableModule,
    MatExpansionModule,
    MatBadgeModule,
    MatRadioModule,
    ExpandDetailsModule,
    SubstanceSelectorModule,
    MatListModule,
    FileSelectModule,
    MatButtonToggleModule,
    NgxJsonViewerModule,
    RouterModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    SubstanceImageModule,
    SubstanceSelectorModule,
    SubstanceFormModule
  ],
  declarations: [
    Ssg4mResultingMaterialsFormComponent
  ],
  exports: [
    Ssg4mResultingMaterialsFormComponent
  ]
})
export class SubstanceFormSsg4mResultingMaterialsModule { }
