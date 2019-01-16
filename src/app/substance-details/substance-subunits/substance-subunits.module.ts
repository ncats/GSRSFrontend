import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceSubunitsComponent } from './substance-subunits.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceSubunitsComponent)
  ],
  declarations: [SubstanceSubunitsComponent]
})
export class SubstanceSubunitsModule { }
