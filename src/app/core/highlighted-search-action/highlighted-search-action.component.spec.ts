import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { vi } from 'vitest';

import { HighlightedSearchActionComponent } from './highlighted-search-action.component';

describe('HighlightedSearchActionComponent', () => {
  let component: HighlightedSearchActionComponent;
  let fixture: ComponentFixture<HighlightedSearchActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightedSearchActionComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // constructor reads data.searchTerm directly.
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: { searchTerm: '' } },
        { provide: MatBottomSheetRef, useValue: { dismiss: vi.fn() } },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightedSearchActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
