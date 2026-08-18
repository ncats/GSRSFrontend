import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AmountFormDialogComponent } from './amount-form-dialog.component';

describe('AmountFormDialogComponent', () => {
  let component: AmountFormDialogComponent;
  let fixture: ComponentFixture<AmountFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmountFormDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // constructor reads Object.keys(data.subsAmount); ngOnInit subscribes to dialogRef.beforeClosed().
        { provide: MatDialogRef, useValue: { close: vi.fn(), beforeClosed: vi.fn(() => of(null)) } },
        { provide: MAT_DIALOG_DATA, useValue: { subsAmount: {} } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
