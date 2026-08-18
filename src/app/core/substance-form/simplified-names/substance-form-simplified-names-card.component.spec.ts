import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormNamesService } from '@gsrs-core/substance-form/names/substance-form-names.service';
import { SubstanceFormService } from '../substance-form.service';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceFormSimplifiedNamesCardComponent } from './substance-form-simplified-names-card.component';

describe('SubstanceFormSimplifiedNamesCardComponent', () => {
  let component: SubstanceFormSimplifiedNamesCardComponent;
  let fixture: ComponentFixture<SubstanceFormSimplifiedNamesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceFormSimplifiedNamesCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormNamesService, useValue: { substanceNames: NEVER } },
        { provide: SubstanceFormService, useValue: { definition: NEVER } },
        { provide: ScrollToService, useValue: { scrollToElement: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormSimplifiedNamesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
