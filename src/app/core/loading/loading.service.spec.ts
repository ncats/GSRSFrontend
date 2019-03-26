import { TestBed, inject } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
  });

  it('should be created', inject([LoadingService], (service: LoadingService) => {
    expect(service).toBeTruthy();
  }));

  it('should set isLoading boolean and fire event', inject([LoadingService], (service: LoadingService) => {
    service.loadingEvent.subscribe((event: boolean) => {
      expect(event).toBe(true, 'should be set to the value set by the caller');
    });
    service.setLoading(true);
  }));
});
