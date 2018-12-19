import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceRelationshipsComponent } from './substance-relationships.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceRelationshipsComponent)
  ],
  declarations: [SubstanceRelationshipsComponent]
})
export class SubstanceRelationshipsModule { }
