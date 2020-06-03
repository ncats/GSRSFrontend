import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsgGradeFormComponent } from './ssg-grade-form.component';
import { SubstanceFormModule } from '../substance-form.module';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SsgGradeFormComponent),
    SubstanceFormModule,
  ],
  declarations: [
    SsgGradeFormComponent
  ]
})

export class SsgGradeFormModule { }
