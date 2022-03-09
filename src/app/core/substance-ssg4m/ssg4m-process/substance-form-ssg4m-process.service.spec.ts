import { TestBed, inject } from '@angular/core/testing';

import { SubstanceFormSsg4mProcessService } from './substance-form-ssg4m-process.service';

describe('SubstanceSsg4mProcessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubstanceFormSsg4mProcessService]
    });
  });

  it('should be created', inject([SubstanceFormSsg4mProcessService], (service: SubstanceFormSsg4mProcessService) => {
    expect(service).toBeTruthy();
  }));
});
