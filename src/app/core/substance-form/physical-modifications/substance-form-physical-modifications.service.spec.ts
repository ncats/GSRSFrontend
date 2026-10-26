import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormPhysicalModificationsService } from './substance-form-physical-modifications.service';

describe('SubstanceFormPhysicalModificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormPhysicalModificationsService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormPhysicalModificationsService = TestBed.inject(SubstanceFormPhysicalModificationsService);
    expect(service).toBeTruthy();
  });
});
