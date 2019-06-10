import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormReferencesComponent } from './substance-form-references.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../substance-form.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormReferencesComponent),
    SubstanceFormModule
  ],
  declarations: [
    SubstanceFormReferencesComponent
  ]
})
export class SubstanceFormReferencesModule { }
