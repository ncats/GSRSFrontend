import { TestBed } from '@angular/core/testing';

import { GeneralService } from './general.service';

describe('GeneralService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneralService = TestBed.inject(GeneralService);
    expect(service).toBeTruthy();
  });
});
