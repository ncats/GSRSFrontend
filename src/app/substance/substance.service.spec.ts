import { TestBed, inject } from '@angular/core/testing';

import { SubstanceService } from './substance.service';

describe('SubstanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubstanceService]
    });
  });

  it('should be created', inject([SubstanceService], (service: SubstanceService) => {
    expect(service).toBeTruthy();
  }));
});
