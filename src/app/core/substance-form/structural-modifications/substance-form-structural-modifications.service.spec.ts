import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormStructuralModificationsService } from './substance-form-structural-modifications.service';

describe('SubstanceFormStructuralModificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormStructuralModificationsService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormStructuralModificationsService = TestBed.inject(SubstanceFormStructuralModificationsService);
    expect(service).toBeTruthy();
  });
});
