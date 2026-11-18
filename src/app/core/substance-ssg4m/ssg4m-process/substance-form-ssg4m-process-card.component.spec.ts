import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SubstanceFormSsg4mProcessCardComponent } from './substance-form-ssg4m-process-card.component';

@Component({ selector: 'app-ssg4m-process-form', template: '', standalone: true })
class Ssg4mProcessFormStubComponent {
  @Input() process: any;
  @Input() processIndex: any;
  @Input() showAdvancedSettings: any;
  @Input() tabSelectedView: any;
  @Output() processDeleted = new EventEmitter<any>();
  @Output() tabSelectedIndexOut = new EventEmitter<any>();
}

@Component({ selector: 'app-ssg4m-scheme-view', template: '', standalone: true })
class Ssg4mSchemeViewStubComponent {
  @Output() tabSelectedIndexOut = new EventEmitter<any>();
}

describe('SubstanceFormSsg4mProcessCardComponent', () => {
  let component: SubstanceFormSsg4mProcessCardComponent;
  let fixture: ComponentFixture<SubstanceFormSsg4mProcessCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, SubstanceFormSsg4mProcessCardComponent ],
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
    .overrideComponent(SubstanceFormSsg4mProcessCardComponent, {
      set: {
        imports: [MatTabsModule, MatCheckboxModule, MatPaginatorModule, MatButtonModule, MatIconModule, Ssg4mProcessFormStubComponent, Ssg4mSchemeViewStubComponent]
      }
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
