import { TestBed, inject } from '@angular/core/testing';

import { SubstanceFormService } from './substance-form.service';

describe('SubstanceFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubstanceFormService]
    });
  });

  it('should be created', inject([SubstanceFormService], (service: SubstanceFormService) => {
    expect(service).toBeTruthy();
  }));
});
