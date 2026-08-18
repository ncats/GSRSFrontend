import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ApplicationService } from '../../service/application.service';
import { GeneralService } from '../../../service/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { Title } from '@angular/platform-browser';
import { ApplicationDarrtsDetailsComponent } from './application-darrts-details.component';

describe('ApplicationDarrtsDetailsComponent', () => {
  let component: ApplicationDarrtsDetailsComponent;
  let fixture: ComponentFixture<ApplicationDarrtsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ApplicationDarrtsDetailsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ApplicationService, useValue: {} },
        { provide: GeneralService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, queryParamMap: { get: () => null, has: () => false } }, params: of({}), queryParams: of({}), queryParamMap: of({ get: () => null, has: () => false }) } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: Title, useValue: { setTitle: () => {} } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDarrtsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
