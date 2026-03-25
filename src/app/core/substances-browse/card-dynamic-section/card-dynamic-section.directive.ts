import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appCardDynamicSection]',
    standalone: false
})
export class CardDynamicSectionDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
