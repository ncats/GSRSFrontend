import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { vi } from 'vitest';

import { MonitorComponent } from './monitor.component';

describe('MonitorComponent', () => {
  let component: MonitorComponent;
  let fixture: ComponentFixture<MonitorComponent>;

  beforeEach(async () => {
    // ngOnInit -> adminService.queryLoad(...) response flows straight into
    // humanizeFields()/mixResultDisplay(), which read several statistics.* fields
    // with no optional chaining; status: 'COMPLETE' stops refresh()'s self-rescheduling.
    const mockJobResponse = {
      id: 'test-job-id',
      status: 'COMPLETE',
      start: Date.now() - 10000,
      stop: Date.now(),
      statistics: {
        totalRecords: { count: 10 },
        recordsExtractedFailed: 0,
        recordsExtractedSuccess: 10,
        recordsPersistedFailed: 0,
        recordsPersistedSuccess: 10,
        recordsProcessedFailed: 0,
        recordsProcessedSuccess: 10,
        estimatedTimeLeft: 0,
        averageTimeToPersist: 100
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ MonitorComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: 'test-job-id' }) } },
        { provide: Router, useValue: {} },
        { provide: AdminService, useValue: { queryLoad: vi.fn().mockReturnValue(of(mockJobResponse)) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
