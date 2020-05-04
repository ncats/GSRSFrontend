import { TestBed } from '@angular/core/testing';

import { SubstanceFormReferencesService } from './substance-form-references.service';

describe('SubstanceFormReferencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormReferencesService = TestBed.get(SubstanceFormReferencesService);
    expect(service).toBeTruthy();
  });
});
