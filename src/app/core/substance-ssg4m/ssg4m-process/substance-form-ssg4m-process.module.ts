import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormSsg4mProcessCardComponent } from './substance-form-ssg4m-process-card.component';
import { Ssg4mProcessFormComponent } from './ssg4m-process-form.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormSsg4mProcessCardComponent),
    SubstanceFormSsg4mProcessCardComponent,
    Ssg4mProcessFormComponent
  ],
  exports: [
    Ssg4mProcessFormComponent
  ]
})
export class SubstanceSsg4mProcessModule { }
