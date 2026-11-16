import { ExpandableDetailsDirective } from './expandable-details.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('ExpandableDetailsDirective', () => {
  it('should create an instance', () => {
    const nativeElement = document.createElement('DIV');
    const directive = new ExpandableDetailsDirective(new ElementRef(nativeElement), {} as Renderer2);
    expect(directive).toBeTruthy();
  });
});
