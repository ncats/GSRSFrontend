import { TestBed } from '@angular/core/testing';

import { SubstanceFormNamesService } from './substance-form-names.service';

describe('SubstanceFormNamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormNamesService = TestBed.get(SubstanceFormNamesService);
    expect(service).toBeTruthy();
  });
});
