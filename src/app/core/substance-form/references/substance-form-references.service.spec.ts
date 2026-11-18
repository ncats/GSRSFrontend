import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormReferencesService } from './substance-form-references.service';

describe('SubstanceFormReferencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormReferencesService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormReferencesService = TestBed.inject(SubstanceFormReferencesService);
    expect(service).toBeTruthy();
  });
});
