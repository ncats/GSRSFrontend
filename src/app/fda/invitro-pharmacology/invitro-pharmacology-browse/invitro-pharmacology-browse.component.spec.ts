import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ConfigService } from '@gsrs-core/config';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { GeneralService } from '../../service/general.service';
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service';

import { InvitroPharmacologyBrowseComponent } from './invitro-pharmacology-browse.component';

describe('InvitroPharmacologyBrowseComponent', () => {
  let component: InvitroPharmacologyBrowseComponent;
  let fixture: ComponentFixture<InvitroPharmacologyBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyBrowseComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {}, params: {} }, queryParamMap: NEVER } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: Title, useValue: { setTitle: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v } },
        { provide: AuthService, useValue: { getAuth: () => NEVER, hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false } },
        { provide: UtilsService, useValue: { hashCode: () => 1 } },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: FacetsManagerService, useValue: { registerGetFacetsHandler: () => null, unregisterFacetSearchHandler: () => null } },
        { provide: GeneralService, useValue: {} },
        { provide: InvitroPharmacologyService, useValue: { getInvitroPharmacologyFacets: () => null } },
        { provide: Location, useValue: {} },
        { provide: LocationStrategy, useValue: {} },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
