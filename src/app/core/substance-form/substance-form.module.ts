import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessManagerComponent } from './access-manager/access-manager.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TagSelectorComponent } from './tag-selector/tag-selector.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ScrollToModule } from '../scroll-to/scroll-to.module';
import { DomainReferencesComponent } from './domain-references/domain-references.component';
import { ReferenceFormComponent } from './reference-form/reference-form.component';
import { RefernceFormDialogComponent } from './references-dialogs/refernce-form-dialog.component';
import { ReuseReferencesDialogComponent } from './references-dialogs/reuse-references-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

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
    MatDialogModule
  ],
  declarations: [
    AccessManagerComponent,
    TagSelectorComponent,
    DomainReferencesComponent,
    ReferenceFormComponent,
    RefernceFormDialogComponent,
    ReuseReferencesDialogComponent
  ],
  exports: [
    AccessManagerComponent,
    DomainReferencesComponent,
    ReferenceFormComponent,
    RefernceFormDialogComponent,
    ReuseReferencesDialogComponent
  ],
  entryComponents: [
    RefernceFormDialogComponent,
    ReuseReferencesDialogComponent
  ]
})
export class SubstanceFormModule { }
