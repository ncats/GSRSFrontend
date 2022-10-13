import { TestBed } from '@angular/core/testing';

import { SubstanceFormSsg2ManufacturingService } from './substance-form-ssg2-manufacturing.service';

describe('SubstanceFormSsg2ManufacturingService', () => {
  let service: SubstanceFormSsg2ManufacturingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubstanceFormSsg2ManufacturingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
