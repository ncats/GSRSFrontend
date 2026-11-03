import { NgModule } from '@angular/core';
import { SubstanceImageDirective } from './substance-image.directive';


@NgModule({
  imports: [
    SubstanceImageDirective
  ],
  exports: [
    SubstanceImageDirective
  ]
})
export class SubstanceImageModule { }
