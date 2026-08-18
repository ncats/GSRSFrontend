import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ApplicationService } from '../../../application/service/application.service';
import { GeneralService } from '../../../service/general.service';
import { MatDialog } from '@angular/material/dialog';
import { SubstanceApplicationComponent } from './substance-application.component';

describe('SubstanceApplicationComponent', () => {
  let component: SubstanceApplicationComponent;
  let fixture: ComponentFixture<SubstanceApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceApplicationComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), getUser: () => null, logout: () => {} } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: ApplicationService, useValue: {} },
        { provide: GeneralService, useValue: {} },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
