import { TestBed, inject } from '@angular/core/testing';
import { SubstanceFormService } from './substance-form.service';

import { CanDeactivateSubstanceFormGuard } from './can-deactivate-substance-form.guard';

describe('CanDeactivateSubstanceFormGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanDeactivateSubstanceFormGuard,
        { provide: SubstanceFormService, useValue: {} }
      ]
    });
  });

  it('should ...', inject([CanDeactivateSubstanceFormGuard], (guard: CanDeactivateSubstanceFormGuard) => {
    expect(guard).toBeTruthy();
  }));
});
