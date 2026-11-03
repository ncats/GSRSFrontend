import { SubstanceImageDirective } from './substance-image.directive';
import { ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '@gsrs-core/utils';
import { ConfigService } from '@gsrs-core/config';

describe('SubstanceImageDirective', () => {
  it('should create an instance', () => {
    const nativeElement = document.createElement('IMG');
    const directive = new SubstanceImageDirective(
      new ElementRef(nativeElement), {} as UtilsService, {} as ConfigService, {} as HttpClient
    );
    expect(directive).toBeTruthy();
  });
});
