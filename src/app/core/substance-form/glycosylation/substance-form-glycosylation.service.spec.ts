import { TestBed } from '@angular/core/testing';

import { SubstanceFormGlycosylationService } from './substance-form-glycosylation.service';

describe('SubstanceFormGlycosylationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormGlycosylationService = TestBed.get(SubstanceFormGlycosylationService);
    expect(service).toBeTruthy();
  });
});
