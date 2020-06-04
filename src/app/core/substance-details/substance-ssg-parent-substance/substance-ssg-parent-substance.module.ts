import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceSsgParentSubstanceComponent } from './substance-ssg-parent-substance.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { ReferencesManagerModule } from '../../references-manager/references-manager.module';
import { MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceSsgParentSubstanceComponent),
    ReferencesManagerModule,
    MatDialogModule
  ],
  declarations: [
    SubstanceSsgParentSubstanceComponent
  ]
})
export class SubstanceSsgParentSubstanceModule { }
