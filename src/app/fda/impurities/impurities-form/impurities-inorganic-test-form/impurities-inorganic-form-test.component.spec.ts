import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';

import { ImpuritiesInorganicFormTestComponent } from './impurities-inorganic-form-test.component';

describe('ImpuritiesInorganicFormTestComponent', () => {
  let component: ImpuritiesInorganicFormTestComponent;
  let fixture: ComponentFixture<ImpuritiesInorganicFormTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpuritiesInorganicFormTestComponent ],
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
    fixture = TestBed.createComponent(ImpuritiesInorganicFormTestComponent);
    component = fixture.componentInstance;
    component.impuritiesInorganicTest = { impuritiesInorganicList: [] } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
