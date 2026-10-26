import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ssg4mSitesComponent } from './ssg4m-sites.component';

@NgModule({
  imports: [
    CommonModule,
    Ssg4mSitesComponent
  ],
  exports: [
    Ssg4mSitesComponent
  ]
})

export class Ssg4mSitesModule { }
