import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ImpuritiesSubstanceFormComponent } from './impurities-substance-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';
import { GeneralService } from '../../../service/general.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { Router } from '@angular/router';
import { StructureService } from '@gsrs-core/structure';

describe('ImpuritiesSubstanceFormComponent', () => {
  let component: ImpuritiesSubstanceFormComponent;
  let fixture: ComponentFixture<ImpuritiesSubstanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ImpuritiesSubstanceFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ImpuritiesService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: GeneralService, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        // app-substance-selector (now standalone-imported) constructor deps
        { provide: SubstanceService, useValue: {} },
        { provide: SubstanceFormService, useValue: { getStoredRelated: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: ScrollToService, useValue: {} },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), events: of({}) } },
        { provide: StructureService, useValue: {} },
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
