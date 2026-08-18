import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormSsg4mProcessService } from './substance-form-ssg4m-process.service';
import { SubstanceFormSsg4mSitesService } from '../ssg4m-sites/substance-form-ssg4m-sites.service';
import { ConfigService } from '@gsrs-core/config/config.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';

import { SubstanceFormSsg4mProcessCardComponent } from './substance-form-ssg4m-process-card.component';

describe('SubstanceFormSsg4mProcessCardComponent', () => {
  let component: SubstanceFormSsg4mProcessCardComponent;
  let fixture: ComponentFixture<SubstanceFormSsg4mProcessCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceFormSsg4mProcessCardComponent ],
      imports: [ HttpClientTestingModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormSsg4mProcessService, useValue: { specifiedSubstanceG4mProcess: NEVER } },
        { provide: SubstanceFormSsg4mSitesService, useValue: {} },
        { provide: SubstanceFormService, useValue: { substance: NEVER } },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } },
        { provide: ScrollToService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormSsg4mProcessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
