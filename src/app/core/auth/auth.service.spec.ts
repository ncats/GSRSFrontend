import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';
import { AuthService } from './auth.service';
import { ConfigService } from '../config/config.service';
import { Auth } from './auth.model';

// AuthService kicks off a real async chain in its constructor (configService.afterLoad()
// -> fetchAuth() -> http.get('whoami') -> fetchPrivs() -> http.get('allmyprivs')), each hop
// a genuine microtask/HTTP round trip. A macrotask flush lets everything pending settle
// before the next assertion or httpMock interaction, without needing to know the exact
// number of microtask hops involved.
const flush = () => new Promise<void>(resolve => setTimeout(resolve, 0));

const mockAuth = (overrides: Partial<Auth> = {}): Auth => ({
  computedToken: 'test-token',
  identifier: 'testuser',
  roles: [],
  groups: [],
  ...overrides,
} as Auth);

describe('AuthService', () => {
  let httpMock: HttpTestingController;
  let configServiceStub: { configData: any; afterLoad: ReturnType<typeof vi.fn>; environment?: any };

  function createService(configDataOverrides: any = {}): AuthService {
    TestBed.resetTestingModule();
    configServiceStub = {
      configData: { apiBaseUrl: '', isPfdaVersion: false, ...configDataOverrides },
      afterLoad: vi.fn().mockReturnValue(Promise.resolve({})),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: ConfigService, useValue: configServiceStub },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    return TestBed.inject(AuthService);
  }

  afterEach(() => {
    httpMock.verify();
    sessionStorage.removeItem('authToken');
  });

  it('does not expose set()/update() on the public auth/privileges/authLoading signals', async () => {
    const service = createService();
    // .asReadonly() views genuinely lack these methods at runtime, not just at the type
    // level — this is what actually stops a caller from forging privileges via
    // authService.privileges.set([...]) on a service that gates Edit/Delete app-wide.
    expect((service.authState as any).set).toBeUndefined();
    expect((service.authState as any).update).toBeUndefined();
    expect((service.privileges as any).set).toBeUndefined();
    expect((service.privileges as any).update).toBeUndefined();
    expect((service.authLoading as any).set).toBeUndefined();
    expect((service.authLoading as any).update).toBeUndefined();
    await flush();
    httpMock.expectOne(req => req.url.endsWith('whoami')).flush({});
  });

  it('should be created', async () => {
    const service = createService();
    expect(service).toBeTruthy();
    await flush();
    httpMock.expectOne(req => req.url.endsWith('whoami')).flush({});
  });

  describe('initial state, before configService.afterLoad() resolves', () => {
    it('starts in a loading state with no auth and no privileges', async () => {
      const service = createService();
      expect(service.authLoading()).toBe(true);
      expect(service.authState()).toBeNull();
      expect(service.privileges()).toEqual([]);
      expect(service.hasPrivilege('Edit')).toBe(false);
      expect(service.canEdit()).toBe(false);
      await flush();
      httpMock.expectOne(req => req.url.endsWith('whoami')).flush({});
    });
  });

  describe('successful initial auth + privilege load', () => {
    it('populates auth, privileges, and canEdit once both requests resolve', async () => {
      const service = createService();
      await flush();

      const whoamiReq = httpMock.expectOne(req => req.url.endsWith('whoami'));
      whoamiReq.flush(mockAuth());
      await flush();

      const privsReq = httpMock.expectOne(req => req.url.endsWith('allmyprivs'));
      privsReq.flush({ privileges: ['Edit', 'View'] });
      await flush();

      expect(service.authState()?.computedToken).toBe('test-token');
      expect(service.authLoading()).toBe(false);
      expect(service.privileges()).toEqual([{ privilege: 'Edit' }, { privilege: 'View' }]);
      expect(service.hasPrivilege('Edit')).toBe(true);
      expect(service.hasPrivilege('Delete')).toBe(false);
      expect(service.canEdit()).toBe(true);

      // existing async API stays in sync with the new signals
      expect(await service.hasSpecificPrivilege('Edit')).toBe(true);
      expect(await service.canEditData()).toBe(true);
    });
  });

  describe('unauthenticated (no computedToken)', () => {
    it('leaves auth/privileges empty and never requests privileges', async () => {
      const service = createService();
      await flush();

      const whoamiReq = httpMock.expectOne(req => req.url.endsWith('whoami'));
      whoamiReq.flush({});
      await flush();

      expect(service.authState()).toBeNull();
      expect(service.authLoading()).toBe(false);
      expect(service.privileges()).toEqual([]);
      httpMock.expectNone(req => req.url.endsWith('allmyprivs'));
    });
  });

  describe('auth fetch failure', () => {
    it('clears auth state and loading on an HTTP error', async () => {
      const service = createService();
      await flush();

      const whoamiReq = httpMock.expectOne(req => req.url.endsWith('whoami'));
      whoamiReq.flush('server error', { status: 500, statusText: 'Server Error' });
      await flush();

      expect(service.authState()).toBeNull();
      expect(service.authLoading()).toBe(false);
      expect(service.privileges()).toEqual([]);
    });
  });

  describe('privilege staleness on auth clearing', () => {
    it('clears privileges when a later login is rejected, so canEdit does not keep showing a prior session', async () => {
      const service = createService();
      await flush();
      httpMock.expectOne(req => req.url.endsWith('whoami')).flush(mockAuth());
      await flush();
      httpMock.expectOne(req => req.url.endsWith('allmyprivs')).flush({ privileges: ['Edit'] });
      await flush();

      expect(service.canEdit()).toBe(true);

      // a second login attempt (e.g. a different/expired credential) is rejected
      service.login('user', 'wrong').subscribe();
      httpMock.expectOne(req => req.url.endsWith('whoami')).flush({});
      await flush();

      expect(service.authState()).toBeNull();
      expect(service.privileges()).toEqual([]);
      expect(service.canEdit()).toBe(false);
    });

    it('does not retain a previous session\'s stale privileges if a successful re-login\'s privilege fetch fails', async () => {
      const service = createService();
      await flush();
      httpMock.expectOne(req => req.url.endsWith('whoami')).flush(mockAuth());
      await flush();
      httpMock.expectOne(req => req.url.endsWith('allmyprivs')).flush({ privileges: ['Edit'] });
      await flush();

      expect(service.canEdit()).toBe(true);

      // re-login succeeds with a new auth token, but the follow-up privileges fetch fails —
      // must fail closed (no privileges), not silently keep the previous session's Edit.
      let result: Auth | null | undefined;
      service.login('user2', 'pass2').subscribe(r => (result = r));
      httpMock.expectOne(req => req.url.endsWith('whoami')).flush(mockAuth({ computedToken: 'new-token' }));
      await flush();
      httpMock.expectOne(req => req.url.endsWith('allmyprivs')).flush('error', { status: 500, statusText: 'Server Error' });
      await flush();

      expect(result?.computedToken).toBe('new-token');
      expect(service.authState()?.computedToken).toBe('new-token');
      expect(service.privileges()).toEqual([]);
      expect(service.canEdit()).toBe(false);
    });
  });

  describe('login()', () => {
    it('sets auth/privileges and stores the session token on success', async () => {
      const service = createService();
      await flush();
      httpMock.expectOne(req => req.url.endsWith('whoami')).flush({});
      await flush();

      let result: Auth | null | undefined;
      service.login('user', 'pass').subscribe(r => (result = r));

      const loginReq = httpMock.expectOne(req => req.url.endsWith('whoami'));
      loginReq.flush(mockAuth({ computedToken: 'login-token' }));
      await flush();

      const privsReq = httpMock.expectOne(req => req.url.endsWith('allmyprivs'));
      privsReq.flush({ privileges: ['Edit'] });
      await flush();

      expect(result?.computedToken).toBe('login-token');
      expect(service.authState()?.computedToken).toBe('login-token');
      expect(service.canEdit()).toBe(true);
      expect(sessionStorage.getItem('authToken')).toBe('login-token');
    });

    it('clears auth state when credentials are rejected (no computedToken)', async () => {
      const service = createService();
      await flush();
      httpMock.expectOne(req => req.url.endsWith('whoami')).flush({});
      await flush();

      let result: Auth | null | undefined;
      service.login('user', 'wrong').subscribe(r => (result = r));

      httpMock.expectOne(req => req.url.endsWith('whoami')).flush({});
      await flush();

      expect(result).toBeNull();
      expect(service.authState()).toBeNull();
    });
  });

  describe('logout()', () => {
    it('clears privileges synchronously and auth once the request completes', async () => {
      const service = createService();
      await flush();
      httpMock.expectOne(req => req.url.endsWith('whoami')).flush(mockAuth());
      await flush();
      httpMock.expectOne(req => req.url.endsWith('allmyprivs')).flush({ privileges: ['Edit'] });
      await flush();

      expect(service.canEdit()).toBe(true);

      service.logout();
      // privileges are cleared synchronously, before the logout HTTP call even resolves
      expect(service.privileges()).toEqual([]);
      expect(service.canEdit()).toBe(false);

      httpMock.expectOne(req => req.url.endsWith('logout')).flush({});
      await flush();

      expect(service.authState()).toBeNull();
      expect(sessionStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('getAuth() late-subscriber behavior', () => {
    it('gives a subscriber that arrives after auth is already loaded the current value immediately', async () => {
      const service = createService();
      await flush();
      httpMock.expectOne(req => req.url.endsWith('whoami')).flush(mockAuth());
      await flush();
      httpMock.expectOne(req => req.url.endsWith('allmyprivs')).flush({ privileges: [] });
      await flush();

      let received: Auth | null | undefined;
      service.getAuth().subscribe(auth => (received = auth));

      expect(received?.computedToken).toBe('test-token');
    });
  });

  describe('getAuth() lazy re-fetch after an initially-unauthenticated session', () => {
    it('loads privileges too, not just auth, so hasPrivilege() is not stuck fail-closed forever (e.g. after a pfdaLogin popup)', async () => {
      const service = createService();
      await flush();
      // Initial constructor fetch: unauthenticated.
      httpMock.expectOne(req => req.url.endsWith('whoami')).flush({});
      await flush();
      expect(service.authState()).toBeNull();

      // Something (e.g. pfdaLogin(), after the SSO popup closes) calls getAuth() again to
      // re-check, now that the user has authenticated out-of-band. _auth is still null and
      // isLoading is false, so this hits getAuth()'s lazy re-fetch branch.
      service.getAuth().subscribe();
      await flush();
      httpMock.expectOne(req => req.url.endsWith('whoami')).flush(mockAuth());
      await flush();

      const privsReq = httpMock.expectOne(req => req.url.endsWith('allmyprivs'));
      privsReq.flush({ privileges: ['Edit'] });
      await flush();

      expect(service.authState()?.computedToken).toBe('test-token');
      expect(service.hasPrivilege('Edit')).toBe(true);
    });
  });
});
