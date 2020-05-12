
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '@gsrs-core/dynamic-component-loader';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {SubstanceFormModule} from '@gsrs-core/substance-form/substance-form.module';
import {NameResolverModule} from '@gsrs-core/name-resolver/name-resolver.module';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {SubstanceFormStructurallyDiverseSourceComponent} from '@gsrs-core/substance-form/structurally-diverse/substance-form-structurally-diverse-source/substance-form-structurally-diverse-source.component';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormStructurallyDiverseSourceComponent),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    SubstanceFormModule,
    NameResolverModule,
    NgMultiSelectDropDownModule,
    MatRadioModule,
    SubstanceFormModule
  ],
  declarations: [
    SubstanceFormStructurallyDiverseSourceComponent
  ]
})
export class SubstanceFormStructurallyDiverseSourceModule { }
