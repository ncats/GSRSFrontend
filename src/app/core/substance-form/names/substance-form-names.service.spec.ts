import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormNamesService } from './substance-form-names.service';

describe('SubstanceFormNamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormNamesService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormNamesService = TestBed.inject(SubstanceFormNamesService);
    expect(service).toBeTruthy();
  });
});
