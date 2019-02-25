import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicComponentLoaderModule} from '../../dynamic-component-loader/dynamic-component-loader.module';
import {SubstancePrimaryDefinitionComponent} from './substance-primary-definition.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstancePrimaryDefinitionComponent),
    RouterModule
  ],
  declarations: [SubstancePrimaryDefinitionComponent]
})
export class SubstancePrimaryDefinitionModule { }
