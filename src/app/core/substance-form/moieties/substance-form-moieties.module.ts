import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormMoietiesComponent } from './substance-form-moieties.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormMoietiesComponent),
    SubstanceFormModule,
    MatDividerModule,
    SubstanceImageModule
  ],
  declarations: [
    SubstanceFormMoietiesComponent
  ]
})
export class SubstanceFormMoietiesModule { }
