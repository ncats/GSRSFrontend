import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { LoadingService } from '@gsrs-core/loading';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubstanceHistoryDialogComponent } from './substance-history-dialog.component';

describe('SubstanceHistoryDialogComponent', () => {
  let component: SubstanceHistoryDialogComponent;
  let fixture: ComponentFixture<SubstanceHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceHistoryDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: SubstanceService, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => {}, afterClosed: () => of(null) } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
