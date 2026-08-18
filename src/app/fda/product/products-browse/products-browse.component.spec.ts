import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { ProductService } from '../service/product.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { ConfigService } from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '../../../core/google-analytics/google-analytics.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { GeneralService } from '../../service/general.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductsBrowseComponent } from './products-browse.component';

describe('ProductsBrowseComponent', () => {
  let component: ProductsBrowseComponent;
  let fixture: ComponentFixture<ProductsBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ProductsBrowseComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: BulkSearchService, useValue: {} },
        { provide: ProductService, useValue: {} },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), getUser: () => null, logout: () => {} } },
        { provide: FacetsManagerService, useValue: { registerGetFacetsHandler: () => {}, unregisterFacetSearchHandler: () => {}, getFacetParams: () => ({}), clearSelections: () => {} } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, queryParamMap: { get: () => null, has: () => false } }, params: of({}), queryParams: of({}), queryParamMap: of({ get: () => null, has: () => false }) } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: Location, useValue: {} },
        { provide: LocationStrategy, useValue: {} },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v, bypassSecurityTrustUrl: (v: any) => v, bypassSecurityTrustResourceUrl: (v: any) => v } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: GeneralService, useValue: {} },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: Title, useValue: { setTitle: () => {} } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
