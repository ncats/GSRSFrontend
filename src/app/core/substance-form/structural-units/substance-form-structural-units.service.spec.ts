import { TestBed } from '@angular/core/testing';

import { SubstanceFormStructuralUnitsService } from './substance-form-structural-units.service';

describe('SubstanceFormStructuralUnitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormStructuralUnitsService = TestBed.inject(SubstanceFormStructuralUnitsService);
    expect(service).toBeTruthy();
  });
});
