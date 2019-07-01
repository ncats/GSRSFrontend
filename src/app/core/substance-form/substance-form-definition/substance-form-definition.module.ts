import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormDefinitionComponent } from './substance-form-definition.component';
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
import { RouterModule } from '@angular/router';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormDefinitionComponent),
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    SubstanceFormModule,
    SubstanceTextSearchModule,
    RouterModule,
    ScrollToModule
  ],
  declarations: [
    SubstanceFormDefinitionComponent
  ]
})
export class SubstanceFormDefinitionModule { }
