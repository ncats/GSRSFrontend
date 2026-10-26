import { TestBed, inject } from '@angular/core/testing';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';

import { SubstanceFormProteinService } from './substance-form-protein.service';

describe('SubstanceFormProteinService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubstanceFormProteinService,
        { provide: SubstanceFormService, useValue: {} }
      ]
    });
  });

  it('should be created', inject([SubstanceFormProteinService], (service: SubstanceFormProteinService) => {
    expect(service).toBeTruthy();
  }));
});
