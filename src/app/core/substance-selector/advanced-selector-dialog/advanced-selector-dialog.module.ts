import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedSelectorDialogComponent } from './advanced-selector-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    AdvancedSelectorDialogComponent
  ],
  exports: [
    AdvancedSelectorDialogComponent
  ]
})
export class AdvancedSelectorDialogModule { }
