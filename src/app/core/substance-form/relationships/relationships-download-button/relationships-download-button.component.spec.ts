import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, ApplicationRef, PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RelationshipsDownloadButtonComponent } from './relationships-download-button.component';
import { ConfigService } from '@gsrs-core/config/config.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { LoadingService } from '@gsrs-core/loading';
import { MatIconMock } from '../../../../../testing/mat-icon-mock.component';

// A fake AuthService whose hasPrivilege() reads a *real* Angular signal, so this spec can
// prove the component genuinely participates in OnPush's automatic re-check mechanism —
// not just that a getter returns a new value once something else forces a re-render.
class FakeAuthServiceWithRealSignal {
  private readonly _privileges = signal<Array<{ privilege: string }>>([]);
  hasPrivilege(name: string): boolean {
    return this._privileges().some(p => p.privilege === name);
  }
  setPrivilegesForTest(privs: Array<{ privilege: string }>): void {
    this._privileges.set(privs);
  }
  startUserDownload = vi.fn();
}

describe('RelationshipsDownloadButtonComponent', () => {
  let component: RelationshipsDownloadButtonComponent;
  let fixture: ComponentFixture<RelationshipsDownloadButtonComponent>;
  let fakeAuthService: FakeAuthServiceWithRealSignal;

  beforeEach(async () => {
    fakeAuthService = new FakeAuthServiceWithRealSignal();

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [RelationshipsDownloadButtonComponent, MatIconMock],
      providers: [
        { provide: ConfigService, useValue: { configData: { loadedComponents: null } } },
        { provide: AuthService, useValue: fakeAuthService },
        { provide: SubstanceService, useValue: {} },
        { provide: LoadingService, useValue: { setLoading: vi.fn() } },
        { provide: MatDialog, useValue: { open: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RelationshipsDownloadButtonComponent);
    component = fixture.componentInstance;
    component.substance = { uuid: 'test-uuid' };
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('does not render the export button when the user lacks the privilege', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeFalsy();
  });

  it('renders the export button once the privilege is present', () => {
    fakeAuthService.setPrivilegesForTest([{ privilege: 'Export Relationships' }]);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('reacts automatically under real OnPush scheduling once the signal dependency is registered (verified via ApplicationRef.tick — the framework\'s own top-down check, not a manual fixture.detectChanges())', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeFalsy();

    fakeAuthService.setPrivilegesForTest([{ privilege: 'Export Relationships' }]);
    TestBed.inject(ApplicationRef).tick();

    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });

  // Note: a bare `Promise.resolve().then(() => signal.set(...))` from hand-rolled test code
  // does NOT reliably trigger NgZone's stability hook the way a real HTTP macrotask does —
  // confirmed empirically, consistent on both Karma and Vitest. That's not a real production
  // gap (AuthService's privileges signal only ever changes as the result of a genuine
  // HttpClient response); see the "with the real AuthService" describe block below for the
  // ecologically-valid version of this same check, which does pass under autoDetectChanges().
});

// Decisive, ecologically-valid check: does the real AuthService, updated the exact way it
// actually is in production (an HTTP response completing, not a bare test-code signal.set()),
// cause this component to re-render automatically under autoDetectChanges() with zero manual
// detectChanges()/tick() calls anywhere in the test?
describe('RelationshipsDownloadButtonComponent with the real AuthService', () => {
  let fixture: ComponentFixture<RelationshipsDownloadButtonComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [RelationshipsDownloadButtonComponent, MatIconMock],
      providers: [
        {
          provide: ConfigService,
          useValue: { configData: { loadedComponents: null, apiBaseUrl: '' }, afterLoad: vi.fn().mockReturnValue(Promise.resolve({})) },
        },
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SubstanceService, useValue: {} },
        { provide: LoadingService, useValue: { setLoading: vi.fn() } },
        { provide: MatDialog, useValue: { open: vi.fn() } },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RelationshipsDownloadButtonComponent);
    fixture.componentInstance.substance = { uuid: 'test-uuid' };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('renders the export button once the real AuthService loads a matching privilege via HTTP, with no manual detectChanges()/tick() anywhere', async () => {
    fixture.autoDetectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeFalsy();

    const flush = () => new Promise<void>(resolve => setTimeout(resolve, 0));
    await flush();
    httpMock.expectOne(req => req.url.endsWith('whoami')).flush({ computedToken: 'tok', identifier: 'user' });
    await flush();
    httpMock.expectOne(req => req.url.endsWith('allmyprivs')).flush({ privileges: ['Export Relationships'] });
    await flush();

    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });
});
