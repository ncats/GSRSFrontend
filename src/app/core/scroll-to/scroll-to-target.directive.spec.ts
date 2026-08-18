import { ScrollToTargetDirective } from './scroll-to-target.directive';
import { ElementRef } from '@angular/core';
import { ScrollToService } from './scroll-to.service';

describe('ScrollToTargetDirective', () => {
  it('should create an instance', () => {
    const nativeElement = document.createElement('DIV');
    const directive = new ScrollToTargetDirective(new ElementRef(nativeElement), {} as ScrollToService);
    expect(directive).toBeTruthy();
  });
});
