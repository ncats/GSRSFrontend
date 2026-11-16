import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { UtilsService } from '../../utils/utils.service';
import { ConfigService } from '@gsrs-core/config';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DataDictionaryService } from '@gsrs-core/utils/data-dictionary.service';
import { AuthService } from '@gsrs-core/auth';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormReferencesService } from '@gsrs-core/substance-form/references/substance-form-references.service';
import { CodeFormComponent } from './code-form.component';

describe('CodeFormComponent', () => {
  let component: CodeFormComponent;
  let fixture: ComponentFixture<CodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, CodeFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        // also injected by the real, standalone app-access-manager/app-cv-input/app-domain-references
        // children this component's template now renders for real.
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: DataDictionaryService, useValue: { getDictionaryRow: () => ({ fieldName: 'test', CVDomain: 'test' }) } },
        { provide: AuthService, useValue: { hasPrivilege: () => false, getAuth: () => of(null) } },
        { provide: SubstanceFormService, useValue: {} },
        { provide: SubstanceFormReferencesService, useValue: { substanceReferences: of([]) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeFormComponent);
    component = fixture.componentInstance;
    component.code = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
