import { TestBed, inject } from '@angular/core/testing';
import { TopSearchService } from './top-search.service';

describe('TopSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopSearchService]
    });
  });

  it('should be created', inject([TopSearchService], (service: TopSearchService) => {
    expect(service).toBeTruthy();
  }));
});
