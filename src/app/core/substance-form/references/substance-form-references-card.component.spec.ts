import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormReferencesCardComponent } from './substance-form-references-card.component';
import { SubstanceFormReferencesService } from './substance-form-references.service';
import { MatDialog } from '@angular/material/dialog';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ConfigService } from '@gsrs-core/config';
import { of } from 'rxjs';

describe('SubstanceFormReferencesCardComponent', () => {
  let component: SubstanceFormReferencesCardComponent;
  let fixture: ComponentFixture<SubstanceFormReferencesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceFormReferencesCardComponent ],
      providers: [
        // ngAfterViewInit subscribes to this directly, so it needs to actually emit.
        { provide: SubstanceFormReferencesService, useValue: { substanceReferences: of([]) } },
        { provide: MatDialog, useValue: {} },
        { provide: ScrollToService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: {} },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: ConfigService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormReferencesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
