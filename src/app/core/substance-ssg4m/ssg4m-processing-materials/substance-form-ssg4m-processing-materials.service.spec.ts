import { TestBed } from '@angular/core/testing';

import { SubstanceFormSsg4mProcessingMaterialsService } from './substance-form-ssg4m-processing-materials.service';

describe('SubstanceFormSsg4mProcessingMaterialsService', () => {
  let service: SubstanceFormSsg4mProcessingMaterialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubstanceFormSsg4mProcessingMaterialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
