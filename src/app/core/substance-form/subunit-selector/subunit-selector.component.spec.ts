import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormLinksService } from '../links/substance-form-links.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { Renderer2 } from '@angular/core';
import { SubunitSelectorComponent } from './subunit-selector.component';

describe('SubunitSelectorComponent', () => {
  let component: SubunitSelectorComponent;
  let fixture: ComponentFixture<SubunitSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubunitSelectorComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { definition: NEVER, subunitDisplaySequences: NEVER, allSites: NEVER } },
        { provide: SubstanceFormLinksService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        { provide: Renderer2, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubunitSelectorComponent);
    component = fixture.componentInstance;
    component.feature = { name: 'test', siteRange: '1_1-1_1' } as any;
    component.subunitSequences = [{ subunitIndex: 1, subunits: [{ residueIndex: 1, class: '' }] }] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
