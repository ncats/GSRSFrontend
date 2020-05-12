import { TestBed } from '@angular/core/testing';

import { SubstanceFormMixtureComponentsService } from './substance-form-mixture-components.service';

describe('SubstanceFormMixtureComponentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormMixtureComponentsService = TestBed.get(SubstanceFormMixtureComponentsService);
    expect(service).toBeTruthy();
  });
});
