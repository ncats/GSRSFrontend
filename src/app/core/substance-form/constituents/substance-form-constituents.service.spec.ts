import { TestBed } from '@angular/core/testing';

import { SubstanceFormConstituentsService } from './substance-form-constituents.service';

describe('SubstanceFormConstituentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormConstituentsService = TestBed.get(SubstanceFormConstituentsService);
    expect(service).toBeTruthy();
  });
});
