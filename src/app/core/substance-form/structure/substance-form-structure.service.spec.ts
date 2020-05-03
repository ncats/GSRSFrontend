import { TestBed } from '@angular/core/testing';

import { SubstanceFormStructureService } from './substance-form-structure.service';

describe('SubstanceFormStructureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormStructureService = TestBed.get(SubstanceFormStructureService);
    expect(service).toBeTruthy();
  });
});
