import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureImportComponent } from './structure-import/structure-import.component';
import { ReactiveFormsModule } from '@angular/forms';
import { KetcherWrapperModule } from 'ketcher-wrapper';
import { JsdrawWrapperModule } from 'jsdraw-wrapper';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StructureEditorComponent } from './structure-editor.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    KetcherWrapperModule,
    JsdrawWrapperModule
  ],
  declarations: [
    StructureImportComponent,
    StructureEditorComponent
  ],
  exports: [
    StructureImportComponent,
    StructureEditorComponent
  ],
  entryComponents: [
    StructureImportComponent
  ]
})
export class StructureEditorModule { }
