import { ScrollToTriggerDirective } from './scroll-to-trigger.directive';
import { ElementRef } from '@angular/core';

describe('ScrollToTriggerDirective', () => {
  it('should create an instance', () => {
    const nativeElement = document.createElement('DIV');
    const directive = new ScrollToTriggerDirective(new ElementRef(nativeElement));
    expect(directive).toBeTruthy();
  });
});
