import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormLinksService } from '../links/substance-form-links.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { SubunitFormComponent } from './subunit-form.component';

describe('SubunitFormComponent', () => {
  let component: SubunitFormComponent;
  let fixture: ComponentFixture<SubunitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubunitFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { definition: NEVER, subunitDisplaySequences: NEVER, allSites: NEVER } },
        { provide: SubstanceFormLinksService, useValue: {} },
        { provide: ScrollToService, useValue: { scrollToElement: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubunitFormComponent);
    component = fixture.componentInstance;
    component.subunit = { sequence: '' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
