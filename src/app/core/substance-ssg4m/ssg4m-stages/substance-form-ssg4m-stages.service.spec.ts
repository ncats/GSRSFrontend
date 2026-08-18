import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';

import { SubstanceFormSsg4mStagesService } from './substance-form-ssg4m-stages.service';

describe('SubstanceFormSsg4mStagesService', () => {
  let service: SubstanceFormSsg4mStagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
      ]
    });
    service = TestBed.inject(SubstanceFormSsg4mStagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
