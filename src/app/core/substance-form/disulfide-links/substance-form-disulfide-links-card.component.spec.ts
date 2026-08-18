import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormDisulfideLinksCardComponent } from './substance-form-disulfide-links-card.component';
import { SubstanceFormDisulfideLinksService } from './substance-form-disulfide-links.service';
import { SubstanceFormService } from '../substance-form.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('SubstanceFormDisulfideLinksCardComponent', () => {
  let component: SubstanceFormDisulfideLinksCardComponent;
  let fixture: ComponentFixture<SubstanceFormDisulfideLinksCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatIconModule ],
      declarations: [ SubstanceFormDisulfideLinksCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        // ngAfterViewInit subscribes to these observables directly, so the stubs need
        // to actually emit rather than be bare {} objects.
        {
          provide: SubstanceFormDisulfideLinksService,
          useValue: { substanceDisulfideLinks: of([]), substanceCysteineSites: of([]) }
        },
        { provide: SubstanceFormService, useValue: { substanceSubunits: of([]) } },
        { provide: GoogleAnalyticsService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormDisulfideLinksCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
