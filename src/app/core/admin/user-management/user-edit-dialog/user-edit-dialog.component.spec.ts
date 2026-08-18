import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { AuthService } from '@gsrs-core/auth';
import { ConfigService } from '../../../config/config.service';
import { vi } from 'vitest';

import { UserEditDialogComponent } from './user-edit-dialog.component';

describe('UserEditDialogComponent', () => {
  let component: UserEditDialogComponent;
  let fixture: ComponentFixture<UserEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEditDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        // empty data (no user, no userID) drives ngOnInit's "newUser" branch, the simplest path.
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: AdminService,
          useValue: {
            getAllAvailableRoles: vi.fn().mockReturnValue(of([])),
            getGroups: vi.fn().mockReturnValue(of([]))
          }
        },
        { provide: AuthService, useValue: { getUser: vi.fn() } },
        { provide: Router, useValue: {} },
        { provide: ConfigService, useValue: { configData: {} } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
