import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {SubstanceVariantConceptsComponent} from './substance-variant-concepts.component';
import {RouterModule} from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceVariantConceptsComponent),
    RouterModule,
    MatTableModule,
    SubstanceImageModule
  ],
  declarations: [SubstanceVariantConceptsComponent]
})
export class SubstanceVariantConceptsModule { }
