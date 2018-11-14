import { TestBed, inject } from '@angular/core/testing';

import { KetcherWrapperService } from './ketcher-wrapper.service';

describe('KetcherWrapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KetcherWrapperService]
    });
  });

  it('should be created', inject([KetcherWrapperService], (service: KetcherWrapperService) => {
    expect(service).toBeTruthy();
  }));
});
