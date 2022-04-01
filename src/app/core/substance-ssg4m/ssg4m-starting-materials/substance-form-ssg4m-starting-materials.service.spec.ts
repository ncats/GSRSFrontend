import { TestBed } from '@angular/core/testing';

import { SubstanceFormSsg4mStartingMaterialsService } from './substance-form-ssg4m-starting-materials.service';

describe('SubstanceFormSsg4mStartingMaterialsService', () => {
  let service: SubstanceFormSsg4mStartingMaterialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubstanceFormSsg4mStartingMaterialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
