import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';
import { AdverseEventService } from '../service/adverseevent.service';
import { GeneralService } from '../../service/general.service';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '../../../core/google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { AdverseEventsBrowseComponent } from './adverse-events-browse.component';

describe('AdverseEventsBrowseComponent', () => {
  let component: AdverseEventsBrowseComponent;
  let fixture: ComponentFixture<AdverseEventsBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // NO_ERRORS_SCHEMA no longer hides the 3 tab children's own template markup (mat-table, etc.)
      // now that they're real standalone imports rather than an opaque NgModule-declared tag;
      // this spec only needs the constructor deps to resolve, not a rendered result.
      imports: [ HttpClientTestingModule, AdverseEventsBrowseComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AdverseEventService, useValue: {} },
        { provide: GeneralService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, queryParamMap: { get: () => null, has: () => false } }, params: of({}), queryParams: of({}), queryParamMap: of({ get: () => null, has: () => false }) } },
        { provide: Location, useValue: {} },
        { provide: LocationStrategy, useValue: {} },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v, bypassSecurityTrustUrl: (v: any) => v, bypassSecurityTrustResourceUrl: (v: any) => v } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: ConfigService, useValue: { configData: { facets: {} }, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false, getUser: () => null, logout: () => {} } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: Title, useValue: { setTitle: () => {} } },
        { provide: FacetsManagerService, useValue: { registerGetFacetsHandler: () => {}, unregisterFacetSearchHandler: () => {}, getFacetParams: () => ({}), clearSelections: () => {}, clearSelectionsEvent: new Subject() } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseEventsBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
