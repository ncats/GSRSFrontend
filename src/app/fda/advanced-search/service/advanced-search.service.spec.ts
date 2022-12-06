import { TestBed, inject } from '@angular/core/testing';

import { AdvancedSearchService } from './advanced-search.service';

describe('AdvancedSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdvancedSearchService]
    });
  });

  it('should be created', inject([AdvancedSearchService], (service: AdvancedSearchService) => {
    expect(service).toBeTruthy();
  }));
});
