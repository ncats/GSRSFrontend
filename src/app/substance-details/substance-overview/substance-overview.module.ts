import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceOverviewComponent } from './substance-overview.component';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {MatExpansionModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceOverviewComponent),
    ReferencesManagerModule,
    MatExpansionModule,
  ],
  declarations: [SubstanceOverviewComponent]
})
export class SubstanceOverviewModule { }
