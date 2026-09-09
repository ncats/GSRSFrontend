
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import {SubstanceFormConstituentsCardComponent} from '@gsrs-core/substance-form/constituents/substance-form-constituents-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormConstituentsCardComponent),
    SubstanceFormConstituentsCardComponent
  ]
})
export class SubstanceFormConstituentsModule { }
