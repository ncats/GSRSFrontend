import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../utils/utils.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { DataDictionaryService } from '@gsrs-core/utils/data-dictionary.service';
import { AuthService } from '@gsrs-core/auth';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceFormReferencesService } from '@gsrs-core/substance-form/references/substance-form-references.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { Router } from '@angular/router';
import { StructureService } from '@gsrs-core/structure/structure.service';
import { PropertyFormComponent } from './property-form.component';

describe('PropertyFormComponent', () => {
  let component: PropertyFormComponent;
  let fixture: ComponentFixture<PropertyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, PropertyFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: SubstanceFormService, useValue: { getStoredRelated: () => null } },
        // also injected by the real, standalone app-cv-input/app-domain-references/app-substance-selector
        // children this component's template now renders for real.
        { provide: DataDictionaryService, useValue: { getDictionaryRow: () => ({ fieldName: 'test', CVDomain: 'test' }) } },
        { provide: AuthService, useValue: { hasPrivilege: () => false, getAuth: () => of(null) } },
        { provide: ConfigService, useValue: { configData: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: SubstanceFormReferencesService, useValue: { substanceReferences: of([]) } },
        { provide: SubstanceService, useValue: {} },
        { provide: ScrollToService, useValue: {} },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: StructureService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyFormComponent);
    component = fixture.componentInstance;
    component.property = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
