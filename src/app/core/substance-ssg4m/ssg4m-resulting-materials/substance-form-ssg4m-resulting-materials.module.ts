import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ssg4mResultingMaterialsFormComponent } from './ssg4m-resulting-materials-form.component';

@NgModule({
  imports: [
    CommonModule,
    Ssg4mResultingMaterialsFormComponent
  ],
  exports: [
    Ssg4mResultingMaterialsFormComponent
  ]
})
export class SubstanceFormSsg4mResultingMaterialsModule { }
