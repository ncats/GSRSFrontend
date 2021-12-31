import { TestBed, inject } from '@angular/core/testing';

import { ProductService } from './clinical-trial-us.service';

describe('ClinicalTrialUSService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClinicalTrialUSService]
    });
  });

  it('should be created', inject([ClinicalTrialUSService], (service: ClinicalTrialUSService) => {
    expect(service).toBeTruthy();
  }));
});
