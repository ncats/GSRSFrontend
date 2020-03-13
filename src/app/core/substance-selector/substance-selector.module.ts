import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceSelectorComponent } from './substance-selector.component';
import { SubstanceTextSearchModule } from '../substance-text-search/substance-text-search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

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
    SubstanceSelectorComponent
  ],
  exports: [
    SubstanceSelectorComponent
  ]
})
export class SubstanceSelectorModule { }
