import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceSsgDefinitionComponent } from './substance-ssg-definition.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { ReferencesManagerModule } from '../../references-manager/references-manager.module';
import { MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceSsgDefinitionComponent),
    ReferencesManagerModule,
    MatDialogModule
  ],
  declarations: [
    SubstanceSsgDefinitionComponent
  ]
})
export class SubstanceSsgDefinitionModule { }
