import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { PropertyParameterDialogComponent } from './property-parameter-dialog.component';

describe('PropertyParameterDialogComponent', () => {
  let component: PropertyParameterDialogComponent;
  let fixture: ComponentFixture<PropertyParameterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, PropertyParameterDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {}, afterClosed: () => of(null) } },
        { provide: MAT_DIALOG_DATA, useValue: { value: {} } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyParameterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
