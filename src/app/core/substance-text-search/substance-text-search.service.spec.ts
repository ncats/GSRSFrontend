import { TestBed, inject } from '@angular/core/testing';
import { SubstanceTextSearchService } from './substance-text-search.service';

describe('TopSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubstanceTextSearchService]
    });
  });

  it('should be created', inject([SubstanceTextSearchService], (service: SubstanceTextSearchService) => {
    expect(service).toBeTruthy();
  }));
});
