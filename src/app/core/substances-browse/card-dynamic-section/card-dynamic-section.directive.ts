import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appCardDynamicSection]'
})
export class CardDynamicSectionDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
