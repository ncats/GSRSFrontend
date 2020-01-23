import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollToTriggerDirective } from './scroll-to-trigger.directive';
import { ScrollToTargetDirective } from './scroll-to-target.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ScrollToTriggerDirective,
    ScrollToTargetDirective
  ],
  exports: [
    ScrollToTriggerDirective,
    ScrollToTargetDirective
  ]
})
export class ScrollToModule { }
