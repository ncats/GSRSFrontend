import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceNotesComponent } from './substance-notes.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceNotesComponent),
    MatTableModule,
    CdkTableModule
  ],
  declarations: [SubstanceNotesComponent]
})
export class SubstanceNotesModule { }
