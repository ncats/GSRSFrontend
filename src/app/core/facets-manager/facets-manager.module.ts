import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacetsManagerComponent } from './facets-manager.component';
import {
  MatExpansionModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatIconModule,
  MatProgressBarModule,
  MatInputModule,
  MatButtonModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FacetDisplayPipe } from './facet-display.pipe';
import { FacetFilterPipe } from './facet-filter.pipe';
import { CodeDisplayModule } from '@gsrs-core/utils/code-display.module';

@NgModule({
  declarations: [
    FacetsManagerComponent,
    FacetDisplayPipe,
    FacetFilterPipe
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    CodeDisplayModule
  ],
  exports: [
    FacetsManagerComponent,
    FacetDisplayPipe,
    FacetFilterPipe
  ]
})
export class FacetsManagerModule { }
