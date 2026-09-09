import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ConfigService } from '@gsrs-core/config';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StructureService } from '@gsrs-core/structure/structure.service';
import { SubstanceFormMixtureDetailsComponent } from './substance-form-mixture-details.component';

describe('SubstanceFormMixtureDetailsComponent', () => {
  let component: SubstanceFormMixtureDetailsComponent;
  let fixture: ComponentFixture<SubstanceFormMixtureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, SubstanceFormMixtureDetailsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { substance: of({}), resetState: () => null, getStoredRelated: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        // also injected by the real, standalone app-access-manager/app-substance-selector
        // children this component's template now renders for real.
        { provide: SubstanceService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: ScrollToService, useValue: {} },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: StructureService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormMixtureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
