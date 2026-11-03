import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ssg4mStartingMaterialsFormComponent } from './ssg4m-starting-materials-form.component';

@NgModule({
  imports: [
    CommonModule,
    Ssg4mStartingMaterialsFormComponent
  ],
  exports: [
    Ssg4mStartingMaterialsFormComponent
  ]
})
export class SubstanceFormSsg4mStartingMaterialsModule { }
