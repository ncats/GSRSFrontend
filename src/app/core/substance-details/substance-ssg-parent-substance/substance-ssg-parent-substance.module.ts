import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceSsgParentSubstanceComponent } from './substance-ssg-parent-substance.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { ReferencesManagerModule } from '../../references-manager/references-manager.module';
import { MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceSsgParentSubstanceComponent),
    ReferencesManagerModule,
    MatDialogModule,
    RouterModule,
    SubstanceImageModule
  ],
  declarations: [
    SubstanceSsgParentSubstanceComponent
  ]
})
export class SubstanceSsgParentSubstanceModule { }
