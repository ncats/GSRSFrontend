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
import {SubstanceFormStructurallyDiverseOrganismComponent} from
    '@gsrs-core/substance-form/substance-form-structurally-diverse-organism/substance-form-structurally-diverse-organism.component';
import {SubstanceSelectorModule} from '@gsrs-core/substance-selector/substance-selector.module';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormStructurallyDiverseOrganismComponent),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    SubstanceFormModule,
    NameResolverModule,
    NgMultiSelectDropDownModule,
    SubstanceSelectorModule,
    MatDividerModule
  ],
  declarations: [
    SubstanceFormStructurallyDiverseOrganismComponent
  ]
})
export class SubstanceFormStructurallyDiverseOrganismModule { }
