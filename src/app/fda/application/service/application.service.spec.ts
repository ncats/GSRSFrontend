import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@gsrs-core/config';

import { ApplicationService } from './application.service';

describe('ApplicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ApplicationService,
        { provide: ConfigService, useValue: { configData: {} } }
      ]
    });
  });

  it('should be created', inject([ApplicationService], (service: ApplicationService) => {
    expect(service).toBeTruthy();
  }));
});
