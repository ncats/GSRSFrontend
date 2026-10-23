import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { SdfToolsComponent } from './sdf-tools.component';
import { SdfValidatorComponent } from './sdf-validator/sdf-validator.component';
import { SdfImportComponent } from './sdf-import/sdf-import.component';
import { SdfGuideComponent } from './sdf-guide/sdf-guide.component';

@NgModule({
  declarations: [
    SdfToolsComponent,
    SdfValidatorComponent,
    SdfImportComponent,
    SdfGuideComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    SubstanceImageModule
  ],
  exports: [SdfToolsComponent]
})
export class SdfToolsModule {}
