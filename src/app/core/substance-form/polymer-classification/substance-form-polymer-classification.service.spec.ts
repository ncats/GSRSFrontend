import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormPolymerClassificationService } from './substance-form-polymer-classification.service';

describe('SubstanceFormPolymerClassificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormPolymerClassificationService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormPolymerClassificationService = TestBed.inject(SubstanceFormPolymerClassificationService);
    expect(service).toBeTruthy();
  });
});
