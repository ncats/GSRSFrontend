import { TestBed, inject } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';

import { SubstanceFormSsg4mSitesService } from './substance-form-ssg4m-sites.service';

describe('SubstanceFormSsg4mSitesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubstanceFormSsg4mSitesService,
        { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
      ]
    });
  });

  it('should be created', inject([SubstanceFormSsg4mSitesService], (service: SubstanceFormSsg4mSitesService) => {
    expect(service).toBeTruthy();
  }));
});
