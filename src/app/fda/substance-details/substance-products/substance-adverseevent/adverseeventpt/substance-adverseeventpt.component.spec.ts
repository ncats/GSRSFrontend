import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceAdverseEventPtComponent } from './substance-adverseeventpt.component';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverse-event/service/adverseevent.service';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SubstanceAdverseEventPtComponent', () => {
  let component: SubstanceAdverseEventPtComponent;
  let fixture: ComponentFixture<SubstanceAdverseEventPtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceAdverseEventPtComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: {} },
        { provide: AdverseEventService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        // ngOnInit awaits this.
        { provide: AuthService, useValue: { hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false } },
        { provide: MatDialog, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceAdverseEventPtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
