import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormMonomersService } from './substance-form-monomers.service';

describe('SubstanceFormMonomersService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormMonomersService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormMonomersService = TestBed.inject(SubstanceFormMonomersService);
    expect(service).toBeTruthy();
  });
});
