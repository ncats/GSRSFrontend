import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstancePolymerStructureComponent } from './substance-polymer-structure.component';
import {RouterModule} from '@angular/router';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DynamicComponentLoaderModule.forChild(SubstancePolymerStructureComponent),
    SubstanceImageModule
  ],
    declarations: [SubstancePolymerStructureComponent]
})
export class SubstancePolymerStructureModule { }
