import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ssg4mProcessingMaterialsFormComponent } from './ssg4m-processing-materials-form.component';

@NgModule({
  imports: [
    CommonModule,
    Ssg4mProcessingMaterialsFormComponent
  ],
  exports: [
    Ssg4mProcessingMaterialsFormComponent
  ]
})
export class SubstanceFormSsg4mProcessingMaterialsModule { }
