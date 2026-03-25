import { TestBed } from '@angular/core/testing';

import { SubstanceFormPropertiesService } from './substance-form-properties.service';

describe('SubstanceFormPropertiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormPropertiesService = TestBed.inject(SubstanceFormPropertiesService);
    expect(service).toBeTruthy();
  });
});
