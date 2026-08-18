import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormSsg4mSitesService } from './substance-form-ssg4m-sites.service';
import { SubstanceFormSsg4mStagesService } from '../ssg4m-stages/substance-form-ssg4m-stages.service';

import { Ssg4mSitesComponent } from './ssg4m-sites.component';

describe('Ssg4mSitesComponent', () => {
  let component: Ssg4mSitesComponent;
  let fixture: ComponentFixture<Ssg4mSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mSitesComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormSsg4mSitesService, useValue: {} },
        { provide: SubstanceFormSsg4mStagesService, useValue: {} },
        { provide: SubstanceFormService, useValue: { substance: NEVER } },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: ScrollToService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mSitesComponent);
    component = fixture.componentInstance;
    component.site = {} as any;
    component.processIndex = 0;
    component.siteIndex = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
