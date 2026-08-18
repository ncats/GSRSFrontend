import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormLinksService } from './substance-form-links.service';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { SubstanceFormLinksCardComponent } from './substance-form-links_card.component';

describe('SubstanceFormLinksCardComponent', () => {
  let component: SubstanceFormLinksCardComponent;
  let fixture: ComponentFixture<SubstanceFormLinksCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceFormLinksCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormLinksService, useValue: { substanceLinks: NEVER } },
        { provide: SubstanceFormService, useValue: { substanceSubunits: NEVER } },
        { provide: ScrollToService, useValue: { scrollToElement: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormLinksCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
