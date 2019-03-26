import { ScrollNavItemDirective } from './scroll-nav-item.directive';
import { ElementRef } from '@angular/core';

describe('ScrollNavItemDirective', () => {
  it('should create an instance', () => {
    const nativeElement = document.createElement('DIV');
    const directive = new ScrollNavItemDirective(new ElementRef(nativeElement));
    expect(directive).toBeTruthy();
  });
});
