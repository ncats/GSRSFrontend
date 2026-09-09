import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ssg4mStepViewDialogComponent } from './ssg4m-step-view-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    Ssg4mStepViewDialogComponent
  ],
  exports: [
    Ssg4mStepViewDialogComponent
  ]
})
export class Ssg4mStepViewDialogModule { }
