import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormOtherLinksService } from './substance-form-other-links.service';

describe('SubstanceFormOtherLinksService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormOtherLinksService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormOtherLinksService = TestBed.inject(SubstanceFormOtherLinksService);
    expect(service).toBeTruthy();
  });
});
