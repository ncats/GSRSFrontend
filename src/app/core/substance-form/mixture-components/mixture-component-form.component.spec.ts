import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { UtilsService } from '@gsrs-core/utils';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialog } from '@angular/material/dialog';
import { DataDictionaryService } from '@gsrs-core/utils/data-dictionary.service';
import { AuthService } from '@gsrs-core/auth';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { Router } from '@angular/router';
import { StructureService } from '@gsrs-core/structure/structure.service';
import { MixtureComponentFormComponent } from './mixture-component-form.component';

describe('MixtureComponentFormComponent', () => {
  let component: MixtureComponentFormComponent;
  let fixture: ComponentFixture<MixtureComponentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MixtureComponentFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        // also injected by the real, standalone app-cv-input/app-substance-selector
        // children this component's template now renders for real.
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: DataDictionaryService, useValue: { getDictionaryRow: () => ({ fieldName: 'test', CVDomain: 'test' }) } },
        { provide: AuthService, useValue: { hasPrivilege: () => false, getAuth: () => of(null) } },
        { provide: ConfigService, useValue: { configData: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: SubstanceFormService, useValue: { getStoredRelated: () => null } },
        { provide: SubstanceService, useValue: {} },
        { provide: ScrollToService, useValue: {} },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: StructureService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MixtureComponentFormComponent);
    component = fixture.componentInstance;
    component.component = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
