import { TestBed } from '@angular/core/testing';

import { SubstanceFormRelationshipsService } from './substance-form-relationships.service';

describe('SubstanceFormRelationshipsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormRelationshipsService = TestBed.inject(SubstanceFormRelationshipsService);
    expect(service).toBeTruthy();
  });
});
