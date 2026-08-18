import { ExpandDetailsDirective } from './expand-details.directive';
import { Renderer2 } from '@angular/core';

describe('ExpandDetailsDirective', () => {
  it('should create an instance', () => {
    const directive = new ExpandDetailsDirective({} as Renderer2);
    expect(directive).toBeTruthy();
  });
});
