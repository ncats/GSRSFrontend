import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ImpuritiesService } from '../../service/impurities.service';
import { ConfigService } from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ImpuritiesUnspecifiedFormComponent } from './impurities-unspecified-form.component';

describe('ImpuritiesUnspecifiedFormComponent', () => {
  let component: ImpuritiesUnspecifiedFormComponent;
  let fixture: ComponentFixture<ImpuritiesUnspecifiedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ImpuritiesUnspecifiedFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ImpuritiesService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), getUser: () => null, logout: () => {} } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesUnspecifiedFormComponent);
    component = fixture.componentInstance;
    component.impuritiesUnspecified = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
