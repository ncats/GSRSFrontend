import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@gsrs-core/config';

import { AdvancedSearchService } from './advanced-search.service';

describe('AdvancedSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        AdvancedSearchService,
        { provide: ConfigService, useValue: { configData: {} } }
      ]
    });
  });

  it('should be created', inject([AdvancedSearchService], (service: AdvancedSearchService) => {
    expect(service).toBeTruthy();
  }));
});
