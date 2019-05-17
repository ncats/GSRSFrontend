import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceSearchFormComponent } from './substance-search-form.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SubstanceSearchFormComponent
  ],
  exports: [
    SubstanceSearchFormComponent
  ]
})
export class SubstanceSearchFormModule { }
