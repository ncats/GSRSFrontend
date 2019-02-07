import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {SubstanceVariantConceptsComponent} from './substance-variant-concepts.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceVariantConceptsComponent),
  ],
  declarations: [SubstanceVariantConceptsComponent]
})
export class SubstanceVariantConceptsModule { }
