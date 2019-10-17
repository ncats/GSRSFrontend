import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SubstanceFormModule } from '../substance-form.module';
import { NameResolverModule } from '../../name-resolver/name-resolver.module';
import {SubstanceFormProteinDetailsComponent} from '@gsrs-core/substance-form/substance-form-protein-details/substance-form-protein-details.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {TagSelectorComponent} from '@gsrs-core/substance-form/tag-selector/tag-selector.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormProteinDetailsComponent),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    SubstanceFormModule,
    NameResolverModule,
    NgMultiSelectDropDownModule
  ],
  declarations: [
    SubstanceFormProteinDetailsComponent
  ]
})
export class SubstanceFormProteinDetailsModule { }
