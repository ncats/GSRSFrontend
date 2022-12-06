import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Ssg4mStepViewDialogComponent } from './ssg4m-step-view-dialog.component';
import { Ssg4mSchemeViewModule } from '../ssg4m-scheme-view/ssg4m-scheme-view.module';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    Ssg4mSchemeViewModule
  ],
  declarations: [
    Ssg4mStepViewDialogComponent
  ]
})
export class Ssg4mStepViewDialogModule { }
