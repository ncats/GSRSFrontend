import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureExportComponent } from './structure-export/structure-export.component';
import { StructureImageModalComponent } from './structure-image-modal/structure-image-modal.component';
import { StructureImportComponent } from './structure-import/structure-import.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationExtras, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NitrosamineDisplayModule } from '@gsrs-core/nitrosamine-standalone/nitrosamine-display/nitrosamine-display.module';
import { FileSelectModule } from '@gsrs-core/file-select/file-select.module';

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
    MatTooltipModule,
    SubstanceImageModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatButtonModule,
    RouterModule,
    FileSelectModule,
    NitrosamineDisplayModule
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
