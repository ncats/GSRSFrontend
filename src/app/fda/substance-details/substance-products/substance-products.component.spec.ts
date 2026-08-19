import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ProductService } from '../../product/service/product.service';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { GeneralService } from '../../service/general.service';
import { MatDialog } from '@angular/material/dialog';
import { SubstanceProductsComponent } from './substance-products.component';

describe('SubstanceProductsComponent', () => {
  let component: SubstanceProductsComponent;
  let fixture: ComponentFixture<SubstanceProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceProductsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: ProductService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false, getUser: () => null, logout: () => {} } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: GeneralService, useValue: {} },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
