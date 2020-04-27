import { TestBed } from '@angular/core/testing';

import { SubstanceFormDisulfideLinksService } from './substance-form-disulfide-links.service';

describe('SubstanceFormDisulfideLinksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubstanceFormDisulfideLinksService = TestBed.get(SubstanceFormDisulfideLinksService);
    expect(service).toBeTruthy();
  });
});
