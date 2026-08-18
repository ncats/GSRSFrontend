import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormRelationshipsService } from './substance-form-relationships.service';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceFormRelationshipsCardComponent } from './substance-form-relationships-card.component';

describe('SubstanceFormRelationshipsCardComponent', () => {
  let component: SubstanceFormRelationshipsCardComponent;
  let fixture: ComponentFixture<SubstanceFormRelationshipsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceFormRelationshipsCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormRelationshipsService, useValue: { substanceRelationships: NEVER } },
        { provide: ScrollToService, useValue: { scrollToElement: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormRelationshipsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
