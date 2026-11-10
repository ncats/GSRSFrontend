import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { LoadingService } from '@gsrs-core/loading';
import { StructureService } from '@gsrs-core/structure';
import { SubstanceService } from '@gsrs-core/substance';
import { ConfigService } from '@gsrs-core/config';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';

import { AdvancedSelectorDialogComponent } from './advanced-selector-dialog.component';

@Component({ selector: 'app-structure-editor', template: '', standalone: true })
class StructureEditorStubComponent {
  @Input() calledFrom: any;
  @Output() editorOnLoad = new EventEmitter<any>();
  @Output() loadedMolfile = new EventEmitter<any>();
}

@Component({ selector: 'app-name-resolver', template: '', standalone: true })
class NameResolverStubComponent {
  @Input() startingName: any;
  @Output() structureSelected = new EventEmitter<any>();
}

@Component({ selector: 'app-substance-text-search', template: '', standalone: true })
class SubstanceTextSearchStubComponent {
  @Input() searchValue: any;
  @Input() placeholder: any;
  @Input() eventCategory: any;
  @Output() searchPerformed = new EventEmitter<any>();
}

describe('AdvancedSelectorDialogComponent', () => {
  let component: AdvancedSelectorDialogComponent;
  let fixture: ComponentFixture<AdvancedSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AdvancedSelectorDialogComponent ],
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
    .overrideComponent(AdvancedSelectorDialogComponent, {
      set: {
        imports: [
          FormsModule,
          MatIconModule,
          MatButtonModule,
          MatTooltipModule,
          StructureEditorStubComponent,
          NameResolverStubComponent,
          MatOptionModule,
          MatFormFieldModule,
          MatSelectModule,
          MatCardModule,
          MatRadioModule,
          MatPaginatorModule,
          MatTabsModule,
          MatSliderModule,
          MatExpansionModule,
          SubstanceTextSearchStubComponent
        ]
      }
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
