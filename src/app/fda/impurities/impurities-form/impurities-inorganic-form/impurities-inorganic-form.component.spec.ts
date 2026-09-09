import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ImpuritiesInorganicFormComponent } from './impurities-inorganic-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { Router } from '@angular/router';
import { StructureService } from '@gsrs-core/structure';

describe('ImpuritiesInorganicFormComponent', () => {
  let component: ImpuritiesInorganicFormComponent;
  let fixture: ComponentFixture<ImpuritiesInorganicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ImpuritiesInorganicFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ImpuritiesService, useValue: {} },
        { provide: ConfigService, useValue: { configData: {} } },
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
    fixture = TestBed.createComponent(ImpuritiesInorganicFormComponent);
    component = fixture.componentInstance;
    component.impuritiesInorganic = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
