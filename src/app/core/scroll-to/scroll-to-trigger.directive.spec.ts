import { ScrollToTriggerDirective } from './scroll-to-trigger.directive';
import { ElementRef } from '@angular/core';
import { ScrollToService } from './scroll-to.service';

describe('ScrollToTriggerDirective', () => {
  it('should create an instance', () => {
    const nativeElement = document.createElement('DIV');
    const directive = new ScrollToTriggerDirective(new ElementRef(nativeElement), {} as ScrollToService);
    expect(directive).toBeTruthy();
  });
});
