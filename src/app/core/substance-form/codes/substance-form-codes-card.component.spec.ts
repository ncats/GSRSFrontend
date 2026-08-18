import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { SubstanceFormCodesService } from './substance-form-codes.service';
import { SubstanceFormService } from '../substance-form.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ConfigService } from '@gsrs-core/config';
import { vi } from 'vitest';

import { SubstanceFormCodesCardComponent } from './substance-form-codes-card.component';

describe('SubstanceFormCodesCardComponent', () => {
  let component: SubstanceFormCodesCardComponent;
  let fixture: ComponentFixture<SubstanceFormCodesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceFormCodesCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // ngAfterViewInit subscribes to both substanceCodes and substanceFormService.definition directly.
        { provide: SubstanceFormCodesService, useValue: { substanceCodes: of([]) } },
        { provide: SubstanceFormService, useValue: { definition: of({}) } },
        { provide: ScrollToService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: vi.fn(), sendPageView: vi.fn() } },
        { provide: ConfigService, useValue: { configData: {} } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormCodesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
