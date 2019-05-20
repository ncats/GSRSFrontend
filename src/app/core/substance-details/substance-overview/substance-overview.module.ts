import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceOverviewComponent } from './substance-overview.component';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {MatExpansionModule, MatIconModule} from '@angular/material';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceOverviewComponent),
    ReferencesManagerModule,
    MatExpansionModule,
    MatIconModule,
    RouterModule
  ],
  declarations: [SubstanceOverviewComponent]
})
export class SubstanceOverviewModule { }
