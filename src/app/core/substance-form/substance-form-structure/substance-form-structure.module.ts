import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormStructureComponent } from './substance-form-structure.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormStructureComponent)
  ],
  declarations: [
    SubstanceFormStructureComponent
  ]
})
export class SubstanceFormStructureModule { }
