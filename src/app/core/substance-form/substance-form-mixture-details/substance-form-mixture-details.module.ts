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
import {SubstanceFormMixtureDetailsComponent} from '@gsrs-core/substance-form/substance-form-mixture-details/substance-form-mixture-details.component';
import {SubstanceSelectorModule} from '@gsrs-core/substance-selector/substance-selector.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormMixtureDetailsComponent),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    SubstanceFormModule,
    NameResolverModule,
    NgMultiSelectDropDownModule,
    SubstanceSelectorModule
  ],
  declarations: [
    SubstanceFormMixtureDetailsComponent
  ]
})
export class SubstanceFormMixtureDetailsModule { }
