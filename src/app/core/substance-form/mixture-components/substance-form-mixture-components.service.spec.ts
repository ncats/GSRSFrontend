import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormMixtureComponentsService } from './substance-form-mixture-components.service';

describe('SubstanceFormMixtureComponentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormMixtureComponentsService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormMixtureComponentsService = TestBed.inject(SubstanceFormMixtureComponentsService);
    expect(service).toBeTruthy();
  });
});
