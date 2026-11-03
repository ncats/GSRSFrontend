import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormLinksService } from './substance-form-links.service';

describe('SubstanceFormLinksService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormLinksService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormLinksService = TestBed.inject(SubstanceFormLinksService);
    expect(service).toBeTruthy();
  });
});
