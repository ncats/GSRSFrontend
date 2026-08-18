import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { SubstanceFormStructurallyDiverseService } from '../substance-form-structurally-diverse.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { SubstanceFormStructurallyDiverseOrganismComponent } from './substance-form-structurally-diverse-organism.component';

describe('SubstanceFormStructurallyDiverseOrganismComponent', () => {
  let component: SubstanceFormStructurallyDiverseOrganismComponent;
  let fixture: ComponentFixture<SubstanceFormStructurallyDiverseOrganismComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceFormStructurallyDiverseOrganismComponent ],
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
    fixture = TestBed.createComponent(SubstanceFormStructurallyDiverseOrganismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
