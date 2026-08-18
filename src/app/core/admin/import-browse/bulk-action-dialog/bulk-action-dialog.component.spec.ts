import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingService } from '@gsrs-core/loading';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { ConfigService } from '@gsrs-core/config';
import { vi } from 'vitest';

import { BulkActionDialogComponent } from './bulk-action-dialog.component';

describe('BulkActionDialogComponent', () => {
  let component: BulkActionDialogComponent;
  let fixture: ComponentFixture<BulkActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkActionDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: AdminService, useValue: {} },
        // ngOnInit reads configService.configData.stagingArea.mergeAction.
        { provide: ConfigService, useValue: { configData: {} } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
