import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormCodesComponent } from './substance-form-codes.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../substance-form.module';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormCodesComponent),
    SubstanceFormModule,
    MatDividerModule
  ],
  declarations: [
    SubstanceFormCodesComponent
  ]
})
export class SubstanceFormCodesModule { }
