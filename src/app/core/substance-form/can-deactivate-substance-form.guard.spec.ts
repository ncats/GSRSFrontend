import { TestBed, async, inject } from '@angular/core/testing';

import { CanDeactivateSubstanceFormGuard } from './can-deactivate-substance-form.guard';

describe('CanDeactivateSubstanceFormGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateSubstanceFormGuard]
    });
  });

  it('should ...', inject([CanDeactivateSubstanceFormGuard], (guard: CanDeactivateSubstanceFormGuard) => {
    expect(guard).toBeTruthy();
  }));
});
