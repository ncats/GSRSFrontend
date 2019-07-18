import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormRelationshipsComponent } from './substance-form-relationships.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormRelationshipsComponent)
  ],
  declarations: [
    SubstanceFormRelationshipsComponent
  ]
})
export class SubstanceFormRelationshipsModule { }
