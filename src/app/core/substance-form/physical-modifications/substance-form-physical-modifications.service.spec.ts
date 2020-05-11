import { TestBed } from '@angular/core/testing';

import { SubstanceFormPhysicalModificationsService } from './substance-form-physical-modifications.service';

describe('SubstanceFormPhysicalModificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormPhysicalModificationsService = TestBed.get(SubstanceFormPhysicalModificationsService);
    expect(service).toBeTruthy();
  });
});
