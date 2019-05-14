import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormOverviewComponent } from './substance-form-overview.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormOverviewComponent)
  ],
  declarations: [SubstanceFormOverviewComponent]
})
export class SubstanceFormOverviewModule { }
