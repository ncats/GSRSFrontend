import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormStructuralUnitsService } from './substance-form-structural-units.service';

describe('SubstanceFormStructuralUnitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormStructuralUnitsService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormStructuralUnitsService = TestBed.inject(SubstanceFormStructuralUnitsService);
    expect(service).toBeTruthy();
  });
});
