import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceSsgGradeComponent } from './substance-ssg-grade.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { ReferencesManagerModule } from '../../references-manager/references-manager.module';
import { MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceSsgGradeComponent),
    ReferencesManagerModule,
    MatDialogModule
  ],
  declarations: [
    SubstanceSsgGradeComponent
  ]
})
export class SubstanceSsgGradeModule { }
