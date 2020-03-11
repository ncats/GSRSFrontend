import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceImageDirective } from './substance-image.directive';


@NgModule({
  declarations: [
    SubstanceImageDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SubstanceImageDirective
  ]
})
export class SubstanceImageModule { }
