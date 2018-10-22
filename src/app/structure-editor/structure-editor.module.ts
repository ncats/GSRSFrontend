import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureImportComponent } from './structure-import/structure-import.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    ReactiveFormsModule
  ],
  declarations: [
    StructureImportComponent
  ],
  exports: [
    StructureImportComponent
  ],
  entryComponents: [
    StructureImportComponent
  ]
})
export class StructureEditorModule { }
