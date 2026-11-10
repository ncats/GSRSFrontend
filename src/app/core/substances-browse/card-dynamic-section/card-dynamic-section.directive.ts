import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appCardDynamicSection]',
    standalone: true
})
export class CardDynamicSectionDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
