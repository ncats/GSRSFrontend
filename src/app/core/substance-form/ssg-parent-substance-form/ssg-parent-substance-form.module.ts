import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsgParentSubstanceFormComponent } from './ssg-parent-substance-form.component';
import { SubstanceFormModule } from '../substance-form.module';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceSelectorModule } from '@gsrs-core/substance-selector/substance-selector.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SsgParentSubstanceFormComponent),
    SubstanceFormModule,
    SubstanceSelectorModule
  ],
  declarations: [
    SsgParentSubstanceFormComponent
  ]
})
export class SsgParentSubstanceFormModule { }
