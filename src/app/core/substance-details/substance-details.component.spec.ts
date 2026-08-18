import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SubstanceDetailsComponent } from './substance-details.component';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../testing/activated-route-stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../config/config.service';
import { LoadingService } from '../loading/loading.service';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { Router } from '@angular/router';
import { RouterStub } from '../../../testing/router-stub';
import { RouterLinkDirectiveMock } from '../../../testing/router-link-mock.directive';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollToModule } from '../scroll-to/scroll-to.module';
import { DynamicComponentLoaderModule } from '../dynamic-component-loader/dynamic-component-loader.module';
import { DynamicComponentLoader } from '../dynamic-component-loader/dynamic-component-loader.service';
import { MatIconMock } from '../../../testing/mat-icon-mock.component';
import { SubstanceCardsService } from './substance-cards.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NEVER } from 'rxjs';

describe('SubstanceDetailsComponent', () => {
  let component: SubstanceDetailsComponent;
  let fixture: ComponentFixture<SubstanceDetailsComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let setNotificationSpy: ReturnType<typeof vi.fn>;
  let routerStub: RouterStub;

  beforeEach(async () => {
    activatedRouteStub = new ActivatedRouteStub(
      {
        'id': 'test_id'
      }
    );

    const configServiceSpy = { configData: vi.fn(), afterLoad: vi.fn().mockReturnValue(Promise.resolve({})) };
    const loadingServiceSpy = { setLoading: vi.fn() };
    setNotificationSpy = vi.fn().mockReturnValue(null);
    const notificationServiceSpy = { setNotification: setNotificationSpy };
    routerStub = new RouterStub();

    const dynamicComponentLoaderSpy = { getComponentFactory: vi.fn() };
    const substanceCardsServiceSpy = { getSubstanceDetailsPropertiesAsync: vi.fn() };
    const breakpointObserverSpy = { observe: vi.fn().mockReturnValue(NEVER) };

    await TestBed.configureTestingModule({
      imports: [
        MatListModule,
        MatSidenavModule,
        MatCardModule,
        MatExpansionModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        ScrollToModule,
        DynamicComponentLoaderModule
      ],
      declarations: [
        SubstanceDetailsComponent,
        RouterLinkDirectiveMock,
        MatIconMock
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MainNotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerStub },
        { provide: DynamicComponentLoader, useValue: dynamicComponentLoaderSpy },
        { provide: SubstanceCardsService, useValue: substanceCardsServiceSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
