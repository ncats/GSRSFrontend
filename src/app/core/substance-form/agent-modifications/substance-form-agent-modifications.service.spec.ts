import { TestBed } from '@angular/core/testing';
import { of, NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormAgentModificationsService } from './substance-form-agent-modifications.service';

describe('SubstanceFormAgentModificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      // service is bare @Injectable(), not providedIn: 'root' - needs an explicit provider too.
      SubstanceFormAgentModificationsService,
      // base class constructor (SubstanceFormServiceBase) subscribes to substanceFormAction
      // directly; NEVER keeps initSubtanceForm() (which needs a shaped `substance`) from firing.
      {
        provide: SubstanceFormService,
        useValue: { substanceFormAction: NEVER, substance: of({}), resetState: () => {}, markAdded: () => {} }
      }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormAgentModificationsService = TestBed.inject(SubstanceFormAgentModificationsService);
    expect(service).toBeTruthy();
  });
});
