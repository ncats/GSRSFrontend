import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { AdverseEventService } from '../service/adverseevent.service';

import { AdverseEventTextSearchComponent } from './adverse-event-text-search.component';

describe('AdverseEventTextSearchComponent', () => {
  let component: AdverseEventTextSearchComponent;
  let fixture: ComponentFixture<AdverseEventTextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdverseEventTextSearchComponent ],
      imports: [ MatAutocompleteModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AdverseEventService, useValue: {} },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: ConfigService, useValue: { configData: {}, environment: {} } },
        { provide: ControlledVocabularyService, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseEventTextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
