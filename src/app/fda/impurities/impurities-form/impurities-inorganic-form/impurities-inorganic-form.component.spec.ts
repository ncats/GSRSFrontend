import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ImpuritiesInorganicFormComponent } from './impurities-inorganic-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';

describe('ImpuritiesInorganicFormComponent', () => {
  let component: ImpuritiesInorganicFormComponent;
  let fixture: ComponentFixture<ImpuritiesInorganicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpuritiesInorganicFormComponent ],
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
    fixture = TestBed.createComponent(ImpuritiesInorganicFormComponent);
    component = fixture.componentInstance;
    component.impuritiesInorganic = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
