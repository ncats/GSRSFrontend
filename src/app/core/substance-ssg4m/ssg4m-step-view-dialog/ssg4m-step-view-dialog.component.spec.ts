import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Ssg4mStepViewDialogComponent } from './ssg4m-step-view-dialog.component';

describe('Ssg4mStepViewDialogComponent', () => {
  let component: Ssg4mStepViewDialogComponent;
  let fixture: ComponentFixture<Ssg4mStepViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mStepViewDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { processIndex: 0, siteIndex: 0, stageIndex: 0 } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mStepViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
