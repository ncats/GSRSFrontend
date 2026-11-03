import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormPropertiesService } from './substance-form-properties.service';

describe('SubstanceFormPropertiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormPropertiesService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormPropertiesService = TestBed.inject(SubstanceFormPropertiesService);
    expect(service).toBeTruthy();
  });
});
