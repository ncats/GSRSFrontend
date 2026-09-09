import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ssg4mCriticalParameterFormComponent } from '../ssg4m-critical-parameter/ssg4m-critical-parameter-form.component';

@NgModule({
  imports: [
    CommonModule,
    Ssg4mCriticalParameterFormComponent
  ],
  exports: [
    Ssg4mCriticalParameterFormComponent
  ]
})
export class Ssg4mCriticalParameterModule { }
