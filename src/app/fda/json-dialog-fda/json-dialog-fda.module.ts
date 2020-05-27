import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { JsonDialogFdaComponent } from './json-dialog-fda.component';
import { Routes, RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    NgxJsonViewerModule,
    RouterModule
  ],
  declarations: [
    JsonDialogFdaComponent
  ],
  exports: [
    JsonDialogFdaComponent
  ],
  entryComponents: [
    JsonDialogFdaComponent
  ]
})
export class JsonDialogFdaModule { }
