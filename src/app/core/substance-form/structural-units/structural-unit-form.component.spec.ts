import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceService } from '@gsrs-core/substance';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { StructuralUnitFormComponent } from './structural-unit-form.component';

describe('StructuralUnitFormComponent', () => {
  let component: StructuralUnitFormComponent;
  let fixture: ComponentFixture<StructuralUnitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ StructuralUnitFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: SubstanceService, useValue: { showImagePopup: NEVER } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: SubstanceFormService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuralUnitFormComponent);
    component = fixture.componentInstance;
    component.unit = { type: '' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
