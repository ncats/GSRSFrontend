import { TestBed } from '@angular/core/testing';

import { SubstanceFormStructuralModificationsService } from './substance-form-structural-modifications.service';

describe('SubstanceFormStructuralModificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormStructuralModificationsService = TestBed.get(SubstanceFormStructuralModificationsService);
    expect(service).toBeTruthy();
  });
});
