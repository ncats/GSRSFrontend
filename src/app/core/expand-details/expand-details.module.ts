import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandDetailsDirective } from './expand-details.directive';
import { ExpandableDetailsDirective } from './expandable-details.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ExpandDetailsDirective,
    ExpandableDetailsDirective
  ],
  exports: [
    ExpandDetailsDirective,
    ExpandableDetailsDirective
  ]
})
export class ExpandDetailsModule { }
