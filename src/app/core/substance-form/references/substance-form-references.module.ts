import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormReferencesCardComponent } from './substance-form-references-card.component';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormReferencesCardComponent),
    SubstanceFormReferencesCardComponent
  ]
})
export class SubstanceFormReferencesModule { }
