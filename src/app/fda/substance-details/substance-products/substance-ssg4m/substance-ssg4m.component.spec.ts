import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { GeneralService } from '../../../service/general.service';
import { SubstanceSsg4mService } from '@gsrs-core/substance-ssg4m/substance-ssg4m-form.service';

import { SubstanceSsg4mComponent } from './substance-ssg4m.component';

describe('SubstanceSsg4mComponent', () => {
  let component: SubstanceSsg4mComponent;
  let fixture: ComponentFixture<SubstanceSsg4mComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceSsg4mComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: SubstanceSsg4mService, useValue: {} },
        { provide: GeneralService, useValue: {} },
        { provide: AuthService, useValue: { hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false } },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSsg4mComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
