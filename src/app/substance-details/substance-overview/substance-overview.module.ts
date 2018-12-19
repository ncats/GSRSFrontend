import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceOverviewComponent } from './substance-overview.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceOverviewComponent)
  ],
  declarations: [SubstanceOverviewComponent]
})
export class SubstanceOverviewModule { }
