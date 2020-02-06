import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstancePolymerStructureComponent } from './substance-polymer-structure.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstancePolymerStructureComponent)
  ],
  declarations: [SubstancePolymerStructureComponent]
})
export class SubstancePolymerStructureModule { }
