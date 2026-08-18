import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ImpuritiesService } from '../../service/impurities.service';
import { ConfigService } from '@gsrs-core/config';
import { GeneralService } from '../../../service/general.service';
import { LoadingService } from '@gsrs-core/loading';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ImpuritiesTestFormComponent } from './impurities-test-form.component';

describe('ImpuritiesTestFormComponent', () => {
  let component: ImpuritiesTestFormComponent;
  let fixture: ComponentFixture<ImpuritiesTestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ImpuritiesTestFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ImpuritiesService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: GeneralService, useValue: {} },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), getUser: () => null, logout: () => {} } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesTestFormComponent);
    component = fixture.componentInstance;
    component.impuritiesTest = {
      impuritiesSolutionList: [], impuritiesDetailsList: [], impuritiesUnspecifiedList: []
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
