import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceRelationshipsComponent } from './substance-relationships.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceRelationshipsComponent),
    MatTableModule
  ],
  declarations: [SubstanceRelationshipsComponent]
})
export class SubstanceRelationshipsModule { }
