import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { SubstanceFormAgentModificationsService } from './substance-form-agent-modifications.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { vi } from 'vitest';

import { SubstanceFormAgentModificationsCardComponent } from './substance-form-agent-modifications-card.component';

describe('SubstanceFormAgentModificationsComponent', () => {
  let component: SubstanceFormAgentModificationsCardComponent;
  let fixture: ComponentFixture<SubstanceFormAgentModificationsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceFormAgentModificationsCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // ngAfterViewInit subscribes to substanceAgentModifications directly.
        { provide: SubstanceFormAgentModificationsService, useValue: { substanceAgentModifications: of([]) } },
        { provide: ScrollToService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: vi.fn(), sendPageView: vi.fn() } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormAgentModificationsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
