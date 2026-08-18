import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { LoadingService } from '@gsrs-core/loading';
import { StructureService } from '@gsrs-core/structure';

import { ImportManagementComponent } from './import-management.component';

describe('ImportManagementComponent', () => {
  let component: ImportManagementComponent;
  let fixture: ComponentFixture<ImportManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportManagementComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AdminService, useValue: { getAdapters: () => NEVER } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), url: '' } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {} } } },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }), closeAll: () => null } },
        { provide: StructureService, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
