import { TestBed } from '@angular/core/testing';

import { CrossEntitySearchService } from './cross-entity-search.service';

describe('CrossEntitySearchService', () => {
  let service: CrossEntitySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrossEntitySearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
