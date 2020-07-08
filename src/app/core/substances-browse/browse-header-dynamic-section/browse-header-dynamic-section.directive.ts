import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appBrowseHeaderDynamicSection]'
})
export class BrowseHeaderDynamicSectionDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
