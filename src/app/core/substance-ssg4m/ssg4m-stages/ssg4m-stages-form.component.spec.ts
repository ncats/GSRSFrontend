import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormSsg4mStagesService } from './substance-form-ssg4m-stages.service';

import { Ssg4mStagesFormComponent } from './ssg4m-stages-form.component';

describe('Ssg4mStagesComponent', () => {
  let component: Ssg4mStagesFormComponent;
  let fixture: ComponentFixture<Ssg4mStagesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ Ssg4mStagesFormComponent ],
      providers: [
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
    fixture = TestBed.createComponent(Ssg4mStagesFormComponent);
    component = fixture.componentInstance;
    component.stage = { startingMaterials: [], processingMaterials: [], resultingMaterials: [], criticalParameters: [] } as any;
    component.processIndex = 0;
    component.siteIndex = 0;
    component.stageIndex = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
