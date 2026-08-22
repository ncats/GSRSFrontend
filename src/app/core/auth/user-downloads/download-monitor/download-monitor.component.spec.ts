import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { DownloadMonitorComponent } from './download-monitor.component';

describe('DownloadMonitorComponent', () => {
  let component: DownloadMonitorComponent;
  let fixture: ComponentFixture<DownloadMonitorComponent>;
  let authService: any;
  let statusResponse: any;

  const runningDownload = {
    id: 'download-id',
    status: 'RUNNING',
    cancelUrl: { url: '/api/v1/profile/downloads/download-id/@cancel' },
    originalQuery: null
  };

  const cancelledDownload = {
    ...runningDownload,
    status: 'CANCELLED',
    cancelled: true
  };

  beforeEach(async () => {
    statusResponse = of({ id: 'download-id', status: 'COMPLETE' });
    authService = {
      getAuth: vi.fn(() => of(null)),
      checkAuth: vi.fn(() => of(null)),
      canEditData: vi.fn(() => Promise.resolve(false)),
      hasSpecificPrivilege: vi.fn(() => Promise.resolve(false)),
      getUser: vi.fn(() => null),
      logout: vi.fn(),
      getUpdateStatus: vi.fn(() => statusResponse),
      changeDownload: vi.fn(() => of(cancelledDownload)),
      deleteDownload: vi.fn(() => of({}))
    };

    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ DownloadMonitorComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AuthService, useValue: authService },
      ]
    })
    .compileComponents();
  });

  function createComponent() {
    fixture = TestBed.createComponent(DownloadMonitorComponent);
    component = fixture.componentInstance;
    component.id = 'download-id';
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('should apply the cancel response optimistically, then re-poll for the authoritative status', () => {
    // The backend's /@cancel acknowledgment isn't always authoritative (confirmed live).
    authService.getUpdateStatus = vi.fn()
      .mockReturnValueOnce(of({ id: 'download-id', status: 'COMPLETE' })) // ngOnInit's initial poll
      .mockReturnValueOnce(of(runningDownload)); // cancel()'s own follow-up refresh(): still RUNNING
    createComponent();
    component.download = runningDownload;

    component.cancel();

    expect(authService.changeDownload.mock.calls[0][0]).toBe(runningDownload.cancelUrl.url);
    expect(authService.getUpdateStatus.mock.calls.length).toBe(2);
    expect(component.download.status).toBe('RUNNING');
  });

  it('should reflect the cancelled status once a follow-up poll confirms it', () => {
    authService.getUpdateStatus = vi.fn()
      .mockReturnValueOnce(of({ id: 'download-id', status: 'COMPLETE' }))
      .mockReturnValueOnce(of(cancelledDownload));
    createComponent();
    component.download = runningDownload;

    component.cancel();

    expect(component.download.status).toBe('CANCELLED');
    expect(component.download.cancelled).toBe(true);
  });

  it('should clear a pending scheduled poll when cancel is invoked, not double-fire it', () => {
    statusResponse = of(runningDownload);
    createComponent();
    component.download = runningDownload;

    component.cancel();

    // No extra call from the timer cancel() should have cleared.
    expect(authService.getUpdateStatus.mock.calls.length).toBe(2);
  });
});
