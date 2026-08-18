import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { ControlledVocabularyService } from '../../../controlled-vocabulary/controlled-vocabulary.service';
import { SubstanceFormReferencesService } from '../substance-form-references.service';
import { MatDialog } from '@angular/material/dialog';
import { ElementRef } from '@angular/core';
import { UtilsService } from '../../../utils/utils.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceFormService } from '../../substance-form.service';
import { DomainReferencesComponent } from './domain-references.component';

describe('DomainReferencesComponent', () => {
  let component: DomainReferencesComponent;
  let fixture: ComponentFixture<DomainReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ DomainReferencesComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        { provide: SubstanceFormReferencesService, useValue: { substanceReferences: NEVER } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: ElementRef, useValue: {} },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: SubstanceFormService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
