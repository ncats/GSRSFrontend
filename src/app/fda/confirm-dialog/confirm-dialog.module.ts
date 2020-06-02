import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Routes, RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    RouterModule
  ],
  declarations: [
    ConfirmDialogComponent
  ],
  exports: [
    ConfirmDialogComponent
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class ConfirmDialogModule { }
