import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { KetcherWrapperModule } from 'ketcher-wrapper';
import { JsdrawWrapperModule } from 'jsdraw-wrapper';
import { FileSelectModule } from 'file-select';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StructureEditorComponent } from './structure-editor.component';
import {DragDropPasteDirective} from '@gsrs-core/substance-form/structure/drag-drop-paste.component';
import { StructureModule } from '@gsrs-core/structure/structure.module';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MolvecModalComponent } from './molvec-modal/molvec-modal/molvec-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    MatMenuModule,
    ReactiveFormsModule,
    KetcherWrapperModule,
    JsdrawWrapperModule,
    FileSelectModule,
    StructureModule
  ],
  declarations: [
    StructureEditorComponent,
    DragDropPasteDirective,
    MolvecModalComponent
  ],
  exports: [
    StructureEditorComponent,
    MolvecModalComponent
  ]
})
export class StructureEditorModule { }
