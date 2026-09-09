import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsgParentSubstanceFormComponent } from './ssg-parent-substance-form.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SsgParentSubstanceFormComponent),
    SsgParentSubstanceFormComponent
  ]
})
export class SsgParentSubstanceFormModule { }
