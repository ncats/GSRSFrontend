import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ImpuritiesSubstanceFormComponent } from './impurities-substance-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';
import { GeneralService } from '../../../service/general.service';

describe('ImpuritiesSubstanceFormComponent', () => {
  let component: ImpuritiesSubstanceFormComponent;
  let fixture: ComponentFixture<ImpuritiesSubstanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpuritiesSubstanceFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ImpuritiesService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: GeneralService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesSubstanceFormComponent);
    component = fixture.componentInstance;
    component.impuritiesSubstance = {
      impuritiesTestList: [],
      impuritiesResidualSolventsList: [],
      impuritiesResidualSolventsTestList: [],
      impuritiesInorganicList: [],
      impuritiesInorganicTestList: []
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
