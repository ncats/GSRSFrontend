import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {SubstanceVariantConceptsComponent} from './substance-variant-concepts.component';
import {RouterModule} from '@angular/router';
import {MatInputModule, MatTableModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceVariantConceptsComponent),
    RouterModule,
    MatTableModule
  ],
  declarations: [SubstanceVariantConceptsComponent]
})
export class SubstanceVariantConceptsModule { }
