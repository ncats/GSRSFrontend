import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsgDefinitionFormComponent } from './ssg-definition-form.component';
import { SubstanceFormModule } from '../substance-form.module';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SsgDefinitionFormComponent),
    SubstanceFormModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    SsgDefinitionFormComponent
  ]
})

export class SsgDefinitionFormModule { }
