import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormStructurallyDiverseService } from './substance-form-structurally-diverse.service';

describe('SubstanceFormStructurallyDiverseService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormStructurallyDiverseService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormStructurallyDiverseService = TestBed.inject(SubstanceFormStructurallyDiverseService);
    expect(service).toBeTruthy();
  });
});
