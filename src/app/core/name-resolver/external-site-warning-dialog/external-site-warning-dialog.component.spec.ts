import '../../../../testing/local-storage-stub';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';
import { vi } from 'vitest';

import { ExternalSiteWarningDialogComponent } from './external-site-warning-dialog.component';

describe('ExternalSiteWarningDialogComponent', () => {
  let component: ExternalSiteWarningDialogComponent;
  let fixture: ComponentFixture<ExternalSiteWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalSiteWarningDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        // ngOnInit reads configService.configData.externalSiteWarning directly.
        { provide: ConfigService, useValue: { configData: { externalSiteWarning: {} } } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalSiteWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
