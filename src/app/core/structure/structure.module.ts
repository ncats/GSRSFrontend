import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureExportComponent } from './structure-export/structure-export.component';
import { StructureImageModalComponent } from './structure-image-modal/structure-image-modal.component';
import { StructureImportComponent } from './structure-import/structure-import.component';
import { Router, NavigationExtras, RouterModule } from '@angular/router';
import { NitrosamineDisplayComponent } from '@gsrs-core/nitrosamine-standalone/nitrosamine-display/nitrosamine-display.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NitrosamineDisplayComponent,
    StructureExportComponent,
    StructureImageModalComponent,
    StructureImportComponent
  ],
  exports: [
    StructureExportComponent,
    StructureImageModalComponent,
    StructureImportComponent
  ],
})
export class StructureModule { }
