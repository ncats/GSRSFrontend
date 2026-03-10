import { TestBed } from '@angular/core/testing';

import { SubstanceFormPolymerClassificationService } from './substance-form-polymer-classification.service';

describe('SubstanceFormPolymerClassificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormPolymerClassificationService = TestBed.inject(SubstanceFormPolymerClassificationService);
    expect(service).toBeTruthy();
  });
});
