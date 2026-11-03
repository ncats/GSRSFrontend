import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { LoadingService } from '@gsrs-core/loading';
import { StructureService } from '@gsrs-core/structure';
import { StructureEditorModule } from '@gsrs-core/structure-editor/structure-editor.module';

import { FragmentWizardComponent } from './fragment-wizard.component';

// real <app-structure-editor> pulls in DOM/Ketcher/JSDraw canvas wiring that
// doesn't survive a headless test environment; stub its DOM surface instead
// of patching the real component, same approach used elsewhere this session.
@Component({
  selector: 'app-structure-editor',
  template: '',
  standalone: true
})
class StructureEditorStubComponent {
  @Output() editorSwitched = new EventEmitter<any>();
  @Output() editorOnLoad = new EventEmitter<any>();
  @Output() loadedMolfile = new EventEmitter<any>();
}

describe('FragmentWizardComponent', () => {
  let component: FragmentWizardComponent;
  let fixture: ComponentFixture<FragmentWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FragmentWizardComponent ],
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
    .overrideComponent(FragmentWizardComponent, {
      remove: { imports: [StructureEditorModule] },
      add: { imports: [StructureEditorStubComponent] }
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
