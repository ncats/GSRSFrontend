import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceAdverseEventCvmComponent } from './substance-adverseeventcvm.component';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverse-event/service/adverseevent.service';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SubstanceAdverseEventCvmComponent', () => {
  let component: SubstanceAdverseEventCvmComponent;
  let fixture: ComponentFixture<SubstanceAdverseEventCvmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceAdverseEventCvmComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: {} },
        { provide: AdverseEventService, useValue: {} },
        // ngOnInit awaits this.
        { provide: AuthService, useValue: { hasSpecificPrivilege: () => Promise.resolve(false) } },
        { provide: LoadingService, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceAdverseEventCvmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
