import { TestBed, inject } from '@angular/core/testing';

import { ScrollToService } from './scroll-to.service';

describe('ScrollToService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollToService]
    });
  });

  it('should be created', inject([ScrollToService], (service: ScrollToService) => {
    expect(service).toBeTruthy();
  }));
});
