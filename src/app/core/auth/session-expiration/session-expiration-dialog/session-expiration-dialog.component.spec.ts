import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { vi } from 'vitest';

import { SessionExpirationDialogComponent } from './session-expiration-dialog.component';

describe('SessionExpirationDialogComponent', () => {
  let component: SessionExpirationDialogComponent;
  let fixture: ComponentFixture<SessionExpirationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionExpirationDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // constructor reads data.sessionExpirationWarning/sessionExpiringAt directly.
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: { sessionExpirationWarning: {}, sessionExpiringAt: 0 } },
        { provide: Router, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {} } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpirationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // ngOnInit starts a real setInterval; ngOnDestroy clears it.
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
