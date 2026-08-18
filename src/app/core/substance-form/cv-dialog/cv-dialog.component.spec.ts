import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { UtilsService } from '@gsrs-core/utils';
import { vi } from 'vitest';

import { CvDialogComponent } from './cv-dialog.component';

describe('CvDialogComponent', () => {
  let component: CvDialogComponent;
  let fixture: ComponentFixture<CvDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        // template reads vocabulary.domain directly with no safe-navigation guard.
        { provide: MAT_DIALOG_DATA, useValue: { vocabulary: { domain: '', terms: [] }, term: '' } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
