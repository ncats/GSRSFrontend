import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@gsrs-core/auth';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { InvitroPharmacologyService } from '../../../invitro-pharmacology/service/invitro-pharmacology.service';
import { GeneralService } from '../../../service/general.service';

import { SubstanceInvitroPharmacologyComponent } from './substance-invitro-pharmacology.component';

describe('SubstanceInvitroPharmacologyComponent', () => {
  let component: SubstanceInvitroPharmacologyComponent;
  let fixture: ComponentFixture<SubstanceInvitroPharmacologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceInvitroPharmacologyComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: AuthService, useValue: { hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false } },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: InvitroPharmacologyService, useValue: {} },
        { provide: GeneralService, useValue: {} },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceInvitroPharmacologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
