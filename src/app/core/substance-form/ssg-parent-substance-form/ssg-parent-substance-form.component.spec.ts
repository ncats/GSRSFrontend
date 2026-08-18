import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { ConfigService } from '@gsrs-core/config/config.service';
import { SsgParentSubstanceFormComponent } from './ssg-parent-substance-form.component';

describe('SsgParentSubstanceFormComponent', () => {
  let component: SsgParentSubstanceFormComponent;
  let fixture: ComponentFixture<SsgParentSubstanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SsgParentSubstanceFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: SubstanceFormService, useValue: { substance: NEVER } },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
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
