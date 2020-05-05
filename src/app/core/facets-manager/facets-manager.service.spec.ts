import { TestBed } from '@angular/core/testing';

import { FacetsManagerService } from './facets-manager.service';

describe('FacetsManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FacetsManagerService = TestBed.get(FacetsManagerService);
    expect(service).toBeTruthy();
  });
});
