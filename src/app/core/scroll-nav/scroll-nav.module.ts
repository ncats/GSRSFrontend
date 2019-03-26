import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollNavDirective } from './scroll-nav.directive';
import { ScrollNavItemDirective } from './scroll-nav-item.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ScrollNavDirective,
    ScrollNavItemDirective
  ],
  exports: [
    ScrollNavDirective,
    ScrollNavItemDirective
  ]
})
export class ScrollNavModule { }
