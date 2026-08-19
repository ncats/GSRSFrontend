import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { SubstanceService } from '@gsrs-core/substance';
import { Router } from '@angular/router';
import { RegistrarsComponent } from './registrars.component';

describe('RegistrarsComponent', () => {
  let component: RegistrarsComponent;
  let fixture: ComponentFixture<RegistrarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ RegistrarsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: ConfigService, useValue: { configData: { registrarDynamicLinks: [], registrarDynamicLinks2: [] }, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false, getUser: () => null, logout: () => {} } },
        { provide: SubstanceService, useValue: {} },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
