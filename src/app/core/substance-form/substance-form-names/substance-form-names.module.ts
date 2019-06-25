import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormNamesComponent } from './substance-form-names.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../substance-form.module';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormNamesComponent),
    SubstanceFormModule,
    MatDividerModule
  ],
  declarations: [
    SubstanceFormNamesComponent
  ]
})
export class SubstanceFormNamesModule { }
