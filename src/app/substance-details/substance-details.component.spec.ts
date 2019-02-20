import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceDetailsComponent } from './substance-details.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../config/config.service';
import { LoadingService } from '../loading/loading.service';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { Router } from '@angular/router';
import { RouterStub } from '../../testing/router-stub';
import { RouterLinkDirectiveStub } from '../../testing/router-link-directive-stub';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollNavModule } from '../scroll-nav/scroll-nav.module';
import { DynamicComponentLoaderModule } from '../dynamic-component-loader/dynamic-component-loader.module';
import { DynamicComponentLoader } from '../dynamic-component-loader/dynamic-component-loader.service';

describe('SubstanceDetailsComponent', () => {
  let component: SubstanceDetailsComponent;
  let fixture: ComponentFixture<SubstanceDetailsComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let setNotificationSpy: jasmine.Spy;
  let routerStub: RouterStub;

  beforeEach(async(() => {
    activatedRouteStub = new ActivatedRouteStub(
      {
        'id': 'test_id'
      }
    );

    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);
    const notificationServiceSpy = jasmine.createSpyObj('MainNotificationService', ['setNotification']);
    setNotificationSpy = notificationServiceSpy.setNotification.and.returnValue(null);
    routerStub = new RouterStub();

    const dynamicComponentLoaderSpy = jasmine.createSpyObj('DynamicComponentLoader', ['getComponentFactory']);

    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatCardModule,
        MatExpansionModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        ScrollNavModule,
        DynamicComponentLoaderModule
      ],
      declarations: [
        SubstanceDetailsComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: MainNotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerStub },
        { provide: DynamicComponentLoader, useValue: dynamicComponentLoaderSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
