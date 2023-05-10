import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { SsgParentSubstanceFormComponent } from './ssg-parent-substance-form.component';
import { SubstanceFormModule } from '../substance-form.module';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceSelectorModule } from '@gsrs-core/substance-selector/substance-selector.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DynamicComponentLoaderModule.forChild(SsgParentSubstanceFormComponent),
    SubstanceFormModule,
    SubstanceSelectorModule
  ],
  declarations: [
    SsgParentSubstanceFormComponent
  ]
})
export class SsgParentSubstanceFormModule { }
