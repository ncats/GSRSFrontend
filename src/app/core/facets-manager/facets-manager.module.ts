import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacetsManagerComponent } from './facets-manager.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { FacetDisplayPipe } from './facet-display.pipe';
import { FacetFilterPipe } from './facet-filter.pipe';

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
    MatButtonModule
  ],
  exports: [
    FacetsManagerComponent,
    FacetDisplayPipe,
    FacetFilterPipe
  ]
})
export class FacetsManagerModule { }
