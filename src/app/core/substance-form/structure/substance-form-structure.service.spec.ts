import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';
import { StructureService } from '@gsrs-core/structure';

import { SubstanceFormStructureService } from './substance-form-structure.service';

describe('SubstanceFormStructureService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormStructureService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } },
      { provide: StructureService, useValue: {} }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormStructureService = TestBed.inject(SubstanceFormStructureService);
    expect(service).toBeTruthy();
  });
});
