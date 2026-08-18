import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '@gsrs-core/utils';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { StructuralModificationFormComponent } from './structural-modification-form.component';

describe('StructuralModificationFormComponent', () => {
  let component: StructuralModificationFormComponent;
  let fixture: ComponentFixture<StructuralModificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ StructuralModificationFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: SubstanceFormService, useValue: { siteString: () => '', definition: NEVER } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuralModificationFormComponent);
    component = fixture.componentInstance;
    component.mod = { sites: [] } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
