import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceFormStructureCardComponent } from './substance-form-structure-card.component';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { StructureEditorModule } from '../../structure-editor/structure-editor.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SubstanceFormModule } from '../substance-form.module';
import { NameResolverModule } from '../../name-resolver/name-resolver.module';
import { DragDropPasteDirective } from '@gsrs-core/substance-form/structure/drag-drop-paste.component';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { NitrosamineDisplayComponent } from './nitrosamine-display/nitrosamine-display.component';
import { NitrosamineDisplayDialogComponent } from './nitrosamine-display-dialog/nitrosamine-display-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormStructureCardComponent),
    StructureEditorModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    SubstanceFormModule,
    NameResolverModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatExpansionModule,
    MatDialogModule
  ],
  declarations: [
    SubstanceFormStructureCardComponent,
    NitrosamineDisplayComponent,
    NitrosamineDisplayDialogComponent,
  ]
})
export class SubstanceFormStructureModule { }
