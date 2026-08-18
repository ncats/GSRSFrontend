import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ClinicalTrialService } from '../../clinical-trial/clinical-trial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ClinicalTrialDetailsComponent } from './clinical-trial-details.component';

describe('ClinicalTrialDetailsComponent', () => {
  let component: ClinicalTrialDetailsComponent;
  let fixture: ComponentFixture<ClinicalTrialDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ClinicalTrialDetailsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ClinicalTrialService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, queryParamMap: { get: () => null, has: () => false } }, params: of({}), queryParams: of({}), queryParamMap: of({ get: () => null, has: () => false }) } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), getUser: () => null, logout: () => {} } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTrialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
