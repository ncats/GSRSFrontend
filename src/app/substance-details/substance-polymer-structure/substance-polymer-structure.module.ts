import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import {RouterModule} from '@angular/router';
import {SubstancePolymerStructureComponent} from './substance-polymer-structure.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstancePolymerStructureComponent),
    RouterModule
  ],
  declarations: [SubstancePolymerStructureComponent]
})
export class SubstancePolymerStructureModule { }
