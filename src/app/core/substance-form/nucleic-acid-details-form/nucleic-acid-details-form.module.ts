import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SubstanceFormModule } from '../substance-form.module';
import { NameResolverModule } from '../../name-resolver/name-resolver.module';
// tslint:disable-next-line:max-line-length
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {NucleicAcidDetailsFormComponent} from '@gsrs-core/substance-form/nucleic-acid-details-form/nucleic-acid-details-form.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(NucleicAcidDetailsFormComponent),
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
    NucleicAcidDetailsFormComponent
  ]
})
export class NucleicAcidDetailsFormModule { }
