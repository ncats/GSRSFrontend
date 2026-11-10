import { CardDynamicSectionDirective } from './card-dynamic-section.directive';
import { ViewContainerRef } from '@angular/core';

describe('CardDynamicSectionDirective', () => {
  it('should create an instance', () => {
    const directive = new CardDynamicSectionDirective({} as ViewContainerRef);
    expect(directive).toBeTruthy();
  });
});
