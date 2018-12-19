import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureDetailsComponent } from './structure-details.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(StructureDetailsComponent)
  ],
  declarations: [
    StructureDetailsComponent
  ]
})
export class StructureDetailsModule { }
