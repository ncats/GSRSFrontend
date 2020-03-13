import { TestBed } from '@angular/core/testing';

import { SsoRefreshService } from './sso-refresh.service';

describe('SsoRefreshService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SsoRefreshService = TestBed.get(SsoRefreshService);
    expect(service).toBeTruthy();
  });
});
