import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormGlycosylationService } from './substance-form-glycosylation.service';

describe('SubstanceFormGlycosylationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      // service is bare @Injectable(), not providedIn: 'root' - needs an explicit provider too.
      SubstanceFormGlycosylationService,
      // base class constructor (SubstanceFormServiceBase) subscribes to substanceFormAction
      // directly; NEVER keeps initSubtanceForm() from firing.
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormGlycosylationService = TestBed.inject(SubstanceFormGlycosylationService);
    expect(service).toBeTruthy();
  });
});
