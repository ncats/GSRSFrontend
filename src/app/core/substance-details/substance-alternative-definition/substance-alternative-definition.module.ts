import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {SubstanceAlternativeDefinitionComponent} from './substance-alternative-definition.component';
import {RouterModule} from '@angular/router';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceAlternativeDefinitionComponent),
    RouterModule,
    SubstanceImageModule
  ],
  declarations: [SubstanceAlternativeDefinitionComponent]
})
export class SubstanceAlternativeDefinitionModule { }
