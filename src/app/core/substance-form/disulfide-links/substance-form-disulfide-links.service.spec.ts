import { TestBed } from '@angular/core/testing';
import { of, NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormDisulfideLinksService } from './substance-form-disulfide-links.service';

describe('SubstanceFormDisulfideLinksService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      // service is bare @Injectable(), not providedIn: 'root' - needs an explicit provider too.
      SubstanceFormDisulfideLinksService,
      // base class constructor (SubstanceFormServiceBase) subscribes to substanceFormAction
      // directly; NEVER keeps initSubtanceForm() (which needs a shaped `substance`) from firing.
      {
        provide: SubstanceFormService,
        useValue: { substanceFormAction: NEVER, substance: of({}), resetState: () => {}, markAdded: () => {} }
      }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormDisulfideLinksService = TestBed.inject(SubstanceFormDisulfideLinksService);
    expect(service).toBeTruthy();
  });
});
