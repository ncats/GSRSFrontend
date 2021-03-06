import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SubstanceFormModule } from '../substance-form.module';
import { NameResolverModule } from '../../name-resolver/name-resolver.module';
import {SubstanceFormPolymerClassificationComponent} from '@gsrs-core/substance-form/polymer-classification/substance-form-polymer-classification.component';
import {SubstanceSelectorModule} from '@gsrs-core/substance-selector/substance-selector.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormPolymerClassificationComponent),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    SubstanceFormModule,
    NameResolverModule,
    SubstanceSelectorModule
  ],
  declarations: [
    SubstanceFormPolymerClassificationComponent
  ]
})
export class SubstanceFormPolymerClassificationModule { }
