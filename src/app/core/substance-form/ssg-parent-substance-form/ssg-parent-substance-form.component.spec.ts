import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { ConfigService } from '@gsrs-core/config/config.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StructureService } from '@gsrs-core/structure/structure.service';
import { SsgParentSubstanceFormComponent } from './ssg-parent-substance-form.component';

describe('SsgParentSubstanceFormComponent', () => {
  let component: SsgParentSubstanceFormComponent;
  let fixture: ComponentFixture<SsgParentSubstanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, SsgParentSubstanceFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: SubstanceFormService, useValue: { substance: NEVER, getStoredRelated: () => null } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        // also injected by the real, standalone app-substance-selector child this
        // component's template now renders for real.
        { provide: SubstanceService, useValue: {} },
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
    fixture = TestBed.createComponent(SsgParentSubstanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
