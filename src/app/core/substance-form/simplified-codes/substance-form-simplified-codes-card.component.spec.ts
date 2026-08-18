import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormCodesService } from '../codes/substance-form-codes.service';
import { SubstanceFormService } from '../substance-form.service';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { SubstanceFormSimplifiedCodesCardComponent } from './substance-form-simplified-codes-card.component';

describe('SubstanceFormSimplifiedCodesCardComponent', () => {
  let component: SubstanceFormSimplifiedCodesCardComponent;
  let fixture: ComponentFixture<SubstanceFormSimplifiedCodesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceFormSimplifiedCodesCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormCodesService, useValue: { substanceCodes: NEVER } },
        { provide: SubstanceFormService, useValue: { definition: NEVER } },
        { provide: ScrollToService, useValue: { scrollToElement: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormSimplifiedCodesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
