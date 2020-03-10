import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {RouterModule} from '@angular/router';
import {SubstanceMixtureSourceComponent} from './substance-mixture-source.component';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceMixtureSourceComponent),
    RouterModule,
    SubstanceImageModule
  ],
  declarations: [SubstanceMixtureSourceComponent]
})
export class SubstanceMixtureSourceModule { }
