import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacetsManagerComponent } from './facets-manager.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
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
