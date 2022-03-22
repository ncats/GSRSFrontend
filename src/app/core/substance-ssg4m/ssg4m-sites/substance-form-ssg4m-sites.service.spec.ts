import { TestBed, inject } from '@angular/core/testing';

import { SubstanceFormSsg4mSitesService } from './substance-form-ssg4m-sites.service';

describe('SubstanceFormSsg4mSitesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubstanceFormSsg4mSitesService]
    });
  });

  it('should be created', inject([SubstanceFormSsg4mSitesService], (service: SubstanceFormSsg4mSitesService) => {
    expect(service).toBeTruthy();
  }));
});
