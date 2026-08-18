import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';

import { Ssg2OverviewFormComponent } from './ssg2-overview-form.component';

describe('Ssg2OverviewFormComponent', () => {
  let component: Ssg2OverviewFormComponent;
  let fixture: ComponentFixture<Ssg2OverviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg2OverviewFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { substance: of({ specifiedSubstanceG2: { substanceRole: '', grade: '', comments: '' } }), resetState: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: ControlledVocabularyService, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg2OverviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
