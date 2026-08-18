import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';

import { ImpuritiesResidualSolventsTestComponent } from './impurities-residual-solvents-test.component';

describe('ImpuritiesResidualSolventsTestComponent', () => {
  let component: ImpuritiesResidualSolventsTestComponent;
  let fixture: ComponentFixture<ImpuritiesResidualSolventsTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpuritiesResidualSolventsTestComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ImpuritiesService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: AuthService, useValue: {} },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesResidualSolventsTestComponent);
    component = fixture.componentInstance;
    component.impuritiesResidualSolventsTest = { impuritiesResidualSolventsList: [] } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
