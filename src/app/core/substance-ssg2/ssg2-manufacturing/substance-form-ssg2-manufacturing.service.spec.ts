import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';

import { SubstanceFormSsg2ManufacturingService } from './substance-form-ssg2-manufacturing.service';

describe('SubstanceFormSsg2ManufacturingService', () => {
  let service: SubstanceFormSsg2ManufacturingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubstanceFormSsg2ManufacturingService,
        { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
      ]
    });
    service = TestBed.inject(SubstanceFormSsg2ManufacturingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
