import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureExportComponent } from './structure-export/structure-export.component';
import { StructureImageModalComponent } from './structure-image-modal/structure-image-modal.component';
import { StructureImportComponent } from './structure-import/structure-import.component';
import { MatIconModule, MatTabsModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSelectModule } from 'file-select';


@NgModule({
  declarations: [
    StructureExportComponent,
    StructureImageModalComponent,
    StructureImportComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    SubstanceImageModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatButtonModule,
    FileSelectModule
  ],
  exports: [
    StructureExportComponent,
    StructureImageModalComponent,
    StructureImportComponent
  ],
  entryComponents: [
    StructureExportComponent,
    StructureImageModalComponent,
    StructureImportComponent
  ]
})
export class StructureModule { }
