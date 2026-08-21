import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedSelectorDialogComponent } from './advanced-selector-dialog.component';
import { SubstanceTextSearchModule } from '../../substance-text-search/substance-text-search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StructureEditorModule } from '@gsrs-core/structure-editor';
import { NameResolverModule } from '@gsrs-core/name-resolver/name-resolver.module';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SubstanceTextSearchModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SubstanceImageModule,
    StructureEditorModule,
    NameResolverModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatRadioModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSliderModule,
    MatExpansionModule,
    FormsModule
  ],
  declarations: [
    AdvancedSelectorDialogComponent
  ],
  exports: [
    AdvancedSelectorDialogComponent
  ]
})
export class AdvancedSelectorDialogModule { }
