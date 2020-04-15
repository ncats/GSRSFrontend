import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SubstanceTextSearchModule } from '@gsrs-core/substance-text-search/substance-text-search.module';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SubstanceSearchSelectorComponent } from './substance-search-selector.component';

@NgModule({
  imports: [
    CommonModule,
    SubstanceTextSearchModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    SubstanceImageModule
  ],
  declarations: [
    SubstanceSearchSelectorComponent
  ],
  exports: [
    SubstanceSearchSelectorComponent
  ]
})
export class SubstanceSearchSelectorModule { }
