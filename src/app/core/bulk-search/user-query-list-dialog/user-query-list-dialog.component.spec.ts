import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER, Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { SubstanceService } from '@gsrs-core/substance';
import { AuthService } from '@gsrs-core/auth';
import { ConfigService } from '@gsrs-core/config';

import { UserQueryListDialogComponent } from './user-query-list-dialog.component';

describe('UserQueryListDialogComponent', () => {
  let component: UserQueryListDialogComponent;
  let fixture: ComponentFixture<UserQueryListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserQueryListDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: BulkSearchService, useValue: { getBulkSearchLists: () => NEVER, listEmitter: new Subject<any>() } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: AdminService, useValue: {} },
        { provide: SubstanceService, useValue: { getAllByEtag: () => NEVER } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: AuthService, useValue: { checkAuth: () => NEVER, hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false } },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v } },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQueryListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
