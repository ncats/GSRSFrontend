import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '@gsrs-core/dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceProductsComponent } from './substance-products.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceProductsComponent)
  ],
  declarations: [
    SubstanceProductsComponent
  ]
})
export class SubstanceProductsModule { }
