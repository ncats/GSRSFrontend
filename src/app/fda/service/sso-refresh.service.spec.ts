import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '@gsrs-core/utils';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';

import { SsoRefreshService } from './sso-refresh.service';

describe('SsoRefreshService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SsoRefreshService,
      { provide: PLATFORM_ID, useValue: 'browser' },
      { provide: UtilsService, useValue: {} },
      { provide: ConfigService, useValue: { configData: {} } },
      { provide: AuthService, useValue: {} },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } }
    ]
  }));

  it('should be created', () => {
    const service: SsoRefreshService = TestBed.inject(SsoRefreshService);
    expect(service).toBeTruthy();
  });
});
