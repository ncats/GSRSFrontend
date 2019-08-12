import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormNotesComponent } from './substance-form-notes.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormNotesComponent),
    SubstanceFormModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [
    SubstanceFormNotesComponent
  ]
})
export class SubstanceFormNotesModule { }
