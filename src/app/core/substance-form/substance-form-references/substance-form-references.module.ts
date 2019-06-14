import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormReferencesComponent } from './substance-form-references.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormReferencesComponent),
    SubstanceFormModule,
    MatDividerModule,
    ScrollToModule
  ],
  declarations: [
    SubstanceFormReferencesComponent
  ]
})
export class SubstanceFormReferencesModule { }
