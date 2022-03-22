import { TestBed } from '@angular/core/testing';

import { SubstanceFormSsg4mResultingMaterialsService } from './substance-form-ssg4m-resulting-materials.service';

describe('SubstanceFormSsg4mResultingMaterialsService', () => {
  let service: SubstanceFormSsg4mResultingMaterialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubstanceFormSsg4mResultingMaterialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
