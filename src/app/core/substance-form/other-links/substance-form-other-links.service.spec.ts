import { TestBed } from '@angular/core/testing';

import { SubstanceFormOtherLinksService } from './substance-form-other-links.service';

describe('SubstanceFormOtherLinksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormOtherLinksService = TestBed.get(SubstanceFormOtherLinksService);
    expect(service).toBeTruthy();
  });
});
