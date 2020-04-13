import { TestBed } from '@angular/core/testing';

import { SubstanceFormCodesService } from './substance-form-codes.service';

describe('SubstanceFormCodesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormCodesService = TestBed.get(SubstanceFormCodesService);
    expect(service).toBeTruthy();
  });
});
