import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { ApplicationService } from '../service/application.service';

import { ApplicationTextSearchComponent } from './application-text-search.component';

describe('ApplicationTextSearchComponent', () => {
  let component: ApplicationTextSearchComponent;
  let fixture: ComponentFixture<ApplicationTextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationTextSearchComponent ],
      imports: [ MatAutocompleteModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ApplicationService, useValue: {} },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: ConfigService, useValue: { configData: {}, environment: {} } },
        { provide: ControlledVocabularyService, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationTextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
