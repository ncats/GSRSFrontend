import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { vi } from 'vitest';

import { MergeActionDialogComponent } from './merge-action-dialog.component';

describe('MergeActionDialogComponent', () => {
  let component: MergeActionDialogComponent;
  let fixture: ComponentFixture<MergeActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeActionDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // ngOnInit calls adminService.getMergeActionSchema() unconditionally.
        { provide: AdminService, useValue: { getMergeActionSchema: vi.fn().mockReturnValue(of({})) } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
