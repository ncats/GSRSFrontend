import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceSelectorComponent } from './substance-selector.component';
import { RouterModule } from '@angular/router';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { AdvancedSelectorDialogModule } from '@gsrs-core/substance-selector/advanced-selector-dialog/advanced-selector-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SubstanceImageModule,
    AdvancedSelectorDialogModule,
    SubstanceSelectorComponent
  ],
  exports: [
    SubstanceSelectorComponent,
    AdvancedSelectorDialogModule
  ]
})
export class SubstanceSelectorModule { }
