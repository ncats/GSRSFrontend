import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { LoadingService } from '@gsrs-core/loading';
import { StructureService } from '@gsrs-core/structure';

import { FragmentWizardComponent } from './fragment-wizard.component';

describe('FragmentWizardComponent', () => {
  let component: FragmentWizardComponent;
  let fixture: ComponentFixture<FragmentWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FragmentWizardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: { getStructureUrl: () => '', getStructureUrlFragment: () => '', validateVocab: () => ({}), addVocabTerm: () => ({}), getFragmentCV: () => ({}) } },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: StructureService, useValue: { interpretStructure: () => ({}) } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: MAT_DIALOG_DATA, useValue: { vocabulary: { domain: 'test', terms: [] }, term: 'test', adminPanel: false } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FragmentWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
