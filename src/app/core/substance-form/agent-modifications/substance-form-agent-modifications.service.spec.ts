import { TestBed } from '@angular/core/testing';

import { SubstanceFormAgentModificationsService } from './substance-form-agent-modifications.service';

describe('SubstanceFormAgentModificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormAgentModificationsService = TestBed.get(SubstanceFormAgentModificationsService);
    expect(service).toBeTruthy();
  });
});
