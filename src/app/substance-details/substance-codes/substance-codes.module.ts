import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceCodesComponent } from './substance-codes.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceCodesComponent)
  ],
  declarations: [SubstanceCodesComponent]
})
export class SubstanceCodesModule { }
