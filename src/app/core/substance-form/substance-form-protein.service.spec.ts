import { TestBed, inject } from '@angular/core/testing';

import { SubstanceFormProteinService } from './substance-form-protein.service';

describe('SubstanceFormProteinService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubstanceFormProteinService]
    });
  });

  it('should be created', inject([SubstanceFormProteinService], (service: SubstanceFormProteinService) => {
    expect(service).toBeTruthy();
  }));
});
