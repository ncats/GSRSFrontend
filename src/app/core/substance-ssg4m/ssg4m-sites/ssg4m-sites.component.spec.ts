import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceFormSsg4mSitesService } from './substance-form-ssg4m-sites.service';
import { SubstanceFormSsg4mStagesService } from '../ssg4m-stages/substance-form-ssg4m-stages.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Ssg4mSitesComponent } from './ssg4m-sites.component';

@Component({ selector: 'app-cv-input', template: '', standalone: true })
class CvInputStubComponent {
  @Input() domain: any;
  @Input() title: any;
  @Input() model: any;
  @Output() valueChange = new EventEmitter<any>();
}

@Component({ selector: 'app-ssg4m-stages-form', template: '', standalone: true })
class Ssg4mStagesFormStubComponent {
  @Input() stage: any;
  @Input() processIndex: any;
  @Input() siteIndex: any;
  @Input() stageIndex: any;
  @Input() showAdvancedSettings: any;
  @Input() tabSelectedView: any;
}

describe('Ssg4mSitesComponent', () => {
  let component: Ssg4mSitesComponent;
  let fixture: ComponentFixture<Ssg4mSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ Ssg4mSitesComponent ],
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
    .overrideComponent(Ssg4mSitesComponent, {
      set: {
        imports: [FormsModule, MatButtonModule, MatTooltipModule, MatIconModule, MatFormFieldModule, MatInputModule, CvInputStubComponent, Ssg4mStagesFormStubComponent]
      }
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
