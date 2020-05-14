import { TestBed } from '@angular/core/testing';

import { SubstanceFormMonomersService } from './substance-form-monomers.service';

describe('SubstanceFormMonomersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormMonomersService = TestBed.get(SubstanceFormMonomersService);
    expect(service).toBeTruthy();
  });
});
