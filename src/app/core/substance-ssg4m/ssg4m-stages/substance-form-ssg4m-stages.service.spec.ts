import { TestBed } from '@angular/core/testing';

import { SubstanceFormSsg4mStagesService } from './substance-form-ssg4m-stages.service';

describe('SubstanceFormSsg4mStagesService', () => {
  let service: SubstanceFormSsg4mStagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubstanceFormSsg4mStagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
