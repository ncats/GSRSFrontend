import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { SubstanceFormStructurallyDiverseService } from '../substance-form-structurally-diverse.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { SubstanceFormStructurallyDiverseSourceComponent } from './substance-form-structurally-diverse-source.component';

describe('SubstanceFormStructurallyDiverseSourceComponent', () => {
  let component: SubstanceFormStructurallyDiverseSourceComponent;
  let fixture: ComponentFixture<SubstanceFormStructurallyDiverseSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceFormStructurallyDiverseSourceComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormStructurallyDiverseService, useValue: { substanceStructurallyDiverse: NEVER } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormStructurallyDiverseSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
