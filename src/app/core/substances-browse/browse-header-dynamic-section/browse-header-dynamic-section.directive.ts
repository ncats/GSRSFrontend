import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appBrowseHeaderDynamicSection]',
    standalone: false
})
export class BrowseHeaderDynamicSectionDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
