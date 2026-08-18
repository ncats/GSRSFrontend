import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfigService } from '@gsrs-core/config';
import { vi } from 'vitest';

import { SubstanceEditImportDialogComponent } from './substance-edit-import-dialog.component';

describe('SubstanceEditImportDialogComponent', () => {
  let component: SubstanceEditImportDialogComponent;
  let fixture: ComponentFixture<SubstanceEditImportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceEditImportDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useValue: {} },
        // constructor reads configService.configData.isPfdaVersion directly.
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceEditImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
