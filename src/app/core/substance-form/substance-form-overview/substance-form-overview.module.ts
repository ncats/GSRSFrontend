import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormOverviewComponent } from './substance-form-overview.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SubstanceFormModule } from '../substance-form.module';
import { SubstanceTextSearchModule } from '../../substance-text-search/substance-text-search.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormOverviewComponent),
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    SubstanceFormModule,
    SubstanceTextSearchModule
  ],
  declarations: [
    SubstanceFormOverviewComponent
  ]
})
export class SubstanceFormOverviewModule { }
