import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { of, Subject } from 'rxjs';
import { SubstanceFormGlycosylationService } from './substance-form-glycosylation.service';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { vi } from 'vitest';

import { SubstanceFormGlycosylationComponent } from './substance-form-glycosylation.component';

describe('SubstanceFormGlycosylationComponent', () => {
  let component: SubstanceFormGlycosylationComponent;
  let fixture: ComponentFixture<SubstanceFormGlycosylationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceFormGlycosylationComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // ngAfterViewInit subscribes to substanceGlycosylation directly. Must NOT emit
        // synchronously on subscribe (unlike of(...)) - that sets `glycosylation` truthy
        // mid-cycle, after the template's @if(glycosylation) already evaluated it falsy in
        // the same detectChanges() pass, tripping NG0100 on the automatic re-check.
        { provide: SubstanceFormGlycosylationService, useValue: { substanceGlycosylation: new Subject<any>() } },
        { provide: SubstanceFormService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: vi.fn(), sendPageView: vi.fn() } },
        // ngOnInit calls getVocabularies(), which calls cvService.getDomainVocabulary(...) unconditionally.
        {
          provide: ControlledVocabularyService,
          useValue: {
            getDomainVocabulary: vi.fn().mockReturnValue(of({ GLYCOSYLATION_TYPE: { list: [] } }))
          }
        },
        { provide: MatDialog, useValue: {} },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormGlycosylationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
