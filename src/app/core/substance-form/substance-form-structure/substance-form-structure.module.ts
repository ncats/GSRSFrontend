import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormStructureComponent } from './substance-form-structure.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { StructureEditorModule } from '../../structure-editor/structure-editor.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SubstanceFormModule } from '../substance-form.module';
import { NameResolverModule } from '../../name-resolver/name-resolver.module';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormStructureComponent),
    StructureEditorModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    SubstanceFormModule,
    NameResolverModule
  ],
  declarations: [
    SubstanceFormStructureComponent
  ]
})
export class SubstanceFormStructureModule { }
