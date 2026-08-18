import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { vi } from 'vitest';

import { CvTermDialogComponent } from './cv-term-dialog.component';

describe('CvTermDialogComponent', () => {
  let component: CvTermDialogComponent;
  let fixture: ComponentFixture<CvTermDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvTermDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        // constructor reads data.vocabulary.terms.sort(...); ngOnInit calls
        // overlayContainerService.getContainerElement().
        { provide: MAT_DIALOG_DATA, useValue: { vocabulary: { terms: [] } } },
        { provide: ControlledVocabularyService, useValue: { getStructureUrl: vi.fn(), getStructure: vi.fn(), validateVocab: vi.fn(), addVocabTerm: vi.fn() } },
        { provide: ScrollToService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvTermDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
