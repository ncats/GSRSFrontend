import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ssg4mSchemeViewComponent } from './ssg4m-scheme-view.component';

@NgModule({
  imports: [
    CommonModule,
    Ssg4mSchemeViewComponent
  ],
  exports: [
    Ssg4mSchemeViewComponent
  ]
})
export class Ssg4mSchemeViewModule { }
