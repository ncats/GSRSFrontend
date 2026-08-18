import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { LoadingService } from '@gsrs-core/loading';
import { StructureService } from '@gsrs-core/structure';
import { SubstanceService } from '@gsrs-core/substance';
import { ConfigService } from '@gsrs-core/config';

import { AdvancedSelectorDialogComponent } from './advanced-selector-dialog.component';

describe('AdvancedSelectorDialogComponent', () => {
  let component: AdvancedSelectorDialogComponent;
  let fixture: ComponentFixture<AdvancedSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedSelectorDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: { getStructureUrl: () => '' } },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: StructureService, useValue: { getMolfile: () => NEVER } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: SubstanceService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: MAT_DIALOG_DATA, useValue: { tab: 0 } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
