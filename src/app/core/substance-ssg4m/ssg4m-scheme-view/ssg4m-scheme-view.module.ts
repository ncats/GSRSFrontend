import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SubstanceFormModule } from '../../substance-form/substance-form.module';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { Ssg4mSchemeViewComponent } from './ssg4m-scheme-view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    SubstanceFormModule,
    SubstanceImageModule
  ],
  declarations: [
    Ssg4mSchemeViewComponent
  ],
  exports: [
    Ssg4mSchemeViewComponent
  ]
})
export class Ssg4mSchemeViewModule { }
