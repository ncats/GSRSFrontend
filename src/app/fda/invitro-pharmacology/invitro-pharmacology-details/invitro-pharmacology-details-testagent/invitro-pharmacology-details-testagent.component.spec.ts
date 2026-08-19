import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { UtilsService } from '@gsrs-core/utils';
import { LoadingService } from '@gsrs-core/loading';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GeneralService } from '../../../service/general.service';
import { InvitroPharmacologyService } from '../../service/invitro-pharmacology.service';

import { InvitroPharmacologyDetailsTestagentComponent } from './invitro-pharmacology-details-testagent.component';

describe('InvitroPharmacologyDetailsTestagentComponent', () => {
  let component: InvitroPharmacologyDetailsTestagentComponent;
  let fixture: ComponentFixture<InvitroPharmacologyDetailsTestagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyDetailsTestagentComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {}, params: {} } } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: AuthService, useValue: { getAuth: () => NEVER, hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false } },
        { provide: UtilsService, useValue: {} },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: FacetsManagerService, useValue: { registerGetFacetsHandler: () => null, unregisterFacetSearchHandler: () => null } },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: GeneralService, useValue: {} },
        { provide: InvitroPharmacologyService, useValue: { getAllAssays: () => NEVER } },
        { provide: Title, useValue: { setTitle: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: Location, useValue: {} },
        { provide: LocationStrategy, useValue: {} },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyDetailsTestagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
