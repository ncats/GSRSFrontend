import { TestBed } from '@angular/core/testing';
import { of, NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormConstituentsService } from './substance-form-constituents.service';

describe('SubstanceFormConstituentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      // service is bare @Injectable(), not providedIn: 'root' - needs an explicit provider too.
      SubstanceFormConstituentsService,
      // base class constructor (SubstanceFormServiceBase) subscribes to substanceFormAction
      // directly; NEVER keeps initSubtanceForm() (which needs a shaped `substance`) from firing.
      {
        provide: SubstanceFormService,
        useValue: {
          substanceFormAction: NEVER,
          substance: of({ specifiedSubstance: {} }),
          resetState: () => {},
          markAdded: () => {}
        }
      }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormConstituentsService = TestBed.inject(SubstanceFormConstituentsService);
    expect(service).toBeTruthy();
  });
});
