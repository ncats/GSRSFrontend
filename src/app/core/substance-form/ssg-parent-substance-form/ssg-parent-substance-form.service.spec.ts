import { TestBed } from '@angular/core/testing';

import { SubstanceFormNotesService } from './substance-form-notes.service';

describe('SubstanceSFormNotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormNotesService = TestBed.inject(SubstanceFormNotesService);
    expect(service).toBeTruthy();
  });
});
