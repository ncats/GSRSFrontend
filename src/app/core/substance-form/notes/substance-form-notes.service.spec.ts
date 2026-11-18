import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormNotesService } from './substance-form-notes.service';

describe('SubstanceFormNotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormNotesService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormNotesService = TestBed.inject(SubstanceFormNotesService);
    expect(service).toBeTruthy();
  });
});
