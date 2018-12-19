import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceNamesComponent } from './substance-names.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceNamesComponent)
  ],
  declarations: [SubstanceNamesComponent]
})
export class SubstanceNamesModule { }
