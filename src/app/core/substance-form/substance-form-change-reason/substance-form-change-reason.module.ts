import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormChangeReasonComponent } from './substance-form-change-reason.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../substance-form.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    SubstanceFormChangeReasonComponent
  ],
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormChangeReasonComponent),
    SubstanceFormModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule
  ]
})
export class SubstanceFormChangeReasonModule { }
