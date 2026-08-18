import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { SubstanceFormConstituentsService } from './substance-form-constituents.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { vi } from 'vitest';

import { SubstanceFormConstituentsCardComponent } from './substance-form-constituents-card.component';

describe('SubstanceFormConstituentsComponent', () => {
  let component: SubstanceFormConstituentsCardComponent;
  let fixture: ComponentFixture<SubstanceFormConstituentsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceFormConstituentsCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // ngAfterViewInit subscribes to substanceConstituents directly.
        { provide: SubstanceFormConstituentsService, useValue: { substanceConstituents: of([]) } },
        { provide: ScrollToService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: vi.fn(), sendPageView: vi.fn() } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormConstituentsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
