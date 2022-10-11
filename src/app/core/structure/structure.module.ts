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
import { FileSelectModule } from 'file-select';
import { MatTooltipModule } from '@angular/material/tooltip';

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
