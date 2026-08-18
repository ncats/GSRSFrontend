import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { SsgDefinitionFormComponent } from './ssg-definition-form.component';

describe('SsgDefinitionFormComponent', () => {
  let component: SsgDefinitionFormComponent;
  let fixture: ComponentFixture<SsgDefinitionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SsgDefinitionFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { substance: NEVER } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsgDefinitionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
