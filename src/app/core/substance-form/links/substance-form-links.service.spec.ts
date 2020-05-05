import { TestBed } from '@angular/core/testing';

import { SubstanceFormLinksService } from './substance-form-links.service';

describe('SubstanceFormLinksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormLinksService = TestBed.get(SubstanceFormLinksService);
    expect(service).toBeTruthy();
  });
});
