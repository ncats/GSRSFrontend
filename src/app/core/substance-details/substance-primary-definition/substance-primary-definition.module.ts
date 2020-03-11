import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {SubstancePrimaryDefinitionComponent} from './substance-primary-definition.component';
import {RouterModule} from '@angular/router';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstancePrimaryDefinitionComponent),
    RouterModule,
    SubstanceImageModule
  ],
  declarations: [SubstancePrimaryDefinitionComponent]
})
export class SubstancePrimaryDefinitionModule { }
