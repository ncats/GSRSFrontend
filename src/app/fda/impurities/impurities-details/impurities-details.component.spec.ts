import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesDetailsComponent } from './impurities-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ImpuritiesService } from '../service/impurities.service';
import { GeneralService } from '../../service/general.service';
import { Title } from '@angular/platform-browser';

describe('ImpuritiesDetailsComponent', () => {
  let component: ImpuritiesDetailsComponent;
  let fixture: ComponentFixture<ImpuritiesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpuritiesDetailsComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: AuthService, useValue: { hasSpecificPrivilege: () => Promise.resolve(false) } },
        { provide: UtilsService, useValue: {} },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: GoogleAnalyticsService, useValue: {} },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: ImpuritiesService, useValue: {} },
        { provide: GeneralService, useValue: {} },
        { provide: Title, useValue: { setTitle: () => null } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
