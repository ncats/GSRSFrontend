import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormStructureComponent } from './substance-form-structure.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { StructureEditorModule } from '../../structure-editor/structure-editor.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormStructureComponent),
    StructureEditorModule
  ],
  declarations: [
    SubstanceFormStructureComponent
  ]
})
export class SubstanceFormStructureModule { }
