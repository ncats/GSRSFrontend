import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormService } from '../substance-form.service';

import { SubstanceFormRelationshipsService } from './substance-form-relationships.service';

describe('SubstanceFormRelationshipsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SubstanceFormRelationshipsService,
      { provide: SubstanceFormService, useValue: { substanceFormAction: NEVER } }
    ]
  }));

  it('should be created', () => {
    const service: SubstanceFormRelationshipsService = TestBed.inject(SubstanceFormRelationshipsService);
    expect(service).toBeTruthy();
  });
});
