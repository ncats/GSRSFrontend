import { TestBed } from '@angular/core/testing';

import { SubstanceFormStructurallyDiverseService } from './substance-form-structurally-diverse.service';

describe('SubstanceFormStructurallyDiverseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormStructurallyDiverseService = TestBed.get(SubstanceFormStructurallyDiverseService);
    expect(service).toBeTruthy();
  });
});
