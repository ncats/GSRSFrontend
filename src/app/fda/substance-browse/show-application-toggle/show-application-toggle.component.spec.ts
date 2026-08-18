import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GeneralService } from '../../service/general.service';
import { ConfigService } from '../../../core/config/config.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { ShowApplicationToggleComponent } from './show-application-toggle.component';

describe('ShowApplicationToggleComponent', () => {
  let component: ShowApplicationToggleComponent;
  let fixture: ComponentFixture<ShowApplicationToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ShowApplicationToggleComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: GeneralService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), getUser: () => null, logout: () => {} } },
        { provide: SubstanceService, useValue: {} },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}), url: '', routerState: { snapshot: { url: '' } }, createUrlTree: () => ({}), serializeUrl: () => '', routeReuseStrategy: { shouldReuseRoute: () => false } } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, queryParamMap: { get: () => null, has: () => false } }, params: of({}), queryParams: of({}), queryParamMap: of({ get: () => null, has: () => false }) } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowApplicationToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
