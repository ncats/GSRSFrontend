import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ControlledVocabularyService } from '../../../controlled-vocabulary/controlled-vocabulary.service';
import { ReuseReferencesDialogComponent } from './reuse-references-dialog.component';

describe('ReuseReferencesDialogComponent', () => {
  let component: ReuseReferencesDialogComponent;
  let fixture: ComponentFixture<ReuseReferencesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ReuseReferencesDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {}, afterClosed: () => of(null), backdropClick: () => NEVER, beforeClosed: () => NEVER } },
        { provide: MAT_DIALOG_DATA, useValue: { domainRefereceUuids: [], substanceReferences: [] } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReuseReferencesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
