import { TestBed, inject } from '@angular/core/testing';

import { AdverseEventService } from './adverseevent.service';

describe('AdverseEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdverseEventService]
    });
  });

  it('should be created', inject([AdverseEventService], (service: AdverseEventService) => {
    expect(service).toBeTruthy();
  }));
});
