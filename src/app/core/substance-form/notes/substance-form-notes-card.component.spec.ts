import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormNotesCardComponent } from './substance-form-notes-card.component';
import { SubstanceFormNotesService } from './substance-form-notes.service';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { of } from 'rxjs';

describe('SubstanceFormNotesCardComponent', () => {
  let component: SubstanceFormNotesCardComponent;
  let fixture: ComponentFixture<SubstanceFormNotesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceFormNotesCardComponent ],
      providers: [
        // ngAfterViewInit subscribes to this directly, so it needs to actually emit.
        { provide: SubstanceFormNotesService, useValue: { substanceNotes: of([]) } },
        { provide: ScrollToService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormNotesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
