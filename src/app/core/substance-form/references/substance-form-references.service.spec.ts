import { TestBed } from '@angular/core/testing';

import { SubstanceFormReferencesService } from './substance-form-references.service';

describe('SubstanceFormReferencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormReferencesService = TestBed.inject(SubstanceFormReferencesService);
    expect(service).toBeTruthy();
  });
});
