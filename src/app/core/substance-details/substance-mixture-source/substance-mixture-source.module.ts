import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {RouterModule} from '@angular/router';
import {SubstanceMixtureSourceComponent} from './substance-mixture-source.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceMixtureSourceComponent),
    RouterModule,
  ],
  declarations: [SubstanceMixtureSourceComponent]
})
export class SubstanceMixtureSourceModule { }
