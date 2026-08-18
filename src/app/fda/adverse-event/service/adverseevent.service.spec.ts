import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@gsrs-core/config';

import { AdverseEventService } from './adverseevent.service';

describe('AdverseEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        AdverseEventService,
        { provide: ConfigService, useValue: { configData: {} } }
      ]
    });
  });

  it('should be created', inject([AdverseEventService], (service: AdverseEventService) => {
    expect(service).toBeTruthy();
  }));
});
