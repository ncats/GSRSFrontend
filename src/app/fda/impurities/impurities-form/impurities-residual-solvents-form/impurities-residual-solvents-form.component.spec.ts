import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ImpuritiesResidualSolventsFormComponent } from './impurities-residual-solvents-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';

describe('ImpuritiesResidualSolventsFormComponent', () => {
  let component: ImpuritiesResidualSolventsFormComponent;
  let fixture: ComponentFixture<ImpuritiesResidualSolventsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpuritiesResidualSolventsFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ImpuritiesService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesResidualSolventsFormComponent);
    component = fixture.componentInstance;
    component.impuritiesResidualSolvents = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
