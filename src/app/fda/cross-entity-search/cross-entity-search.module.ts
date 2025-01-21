import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FacetsManagerModule } from '@gsrs-core/facets-manager';
import { CrossEntitySearchComponent } from './cross-entity-search.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    RouterModule,
    FacetsManagerModule
  ],
  declarations: [
    CrossEntitySearchComponent
  ],
  exports: [
    CrossEntitySearchComponent
  ],
  entryComponents: [
    CrossEntitySearchComponent
  ]
})

export class CrossEntitySearchModule { }



