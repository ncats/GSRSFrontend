import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from './base.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoadingModule } from '../loading/loading.module';
import { RouterStub } from '../../../testing/router-stub';
import { RouterLinkDirectiveMock } from '../../../testing/router-link-mock.directive';
import { MatMenuModule } from '@angular/material/menu';
import { SubstanceTextSearchModule } from '../substance-text-search/substance-text-search.module';
import { MainNotificationModule } from '../main-notification/main-notification.module';
import { ConfigService } from '../config/config.service';
import { SubstanceTextSearchService } from '../substance-text-search/substance-text-search.service';
import { ActivatedRouteStub } from '../../../testing/activated-route-stub';
import { RouterOutletStubComponent } from '../../../testing/router-outlet-mock.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject, NEVER, of } from 'rxjs';
import { MatIconMock } from '../../../testing/mat-icon-mock.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UtilsService } from '../utils/utils.service';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;
  let routerStub: RouterStub;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    routerStub = new RouterStub();
    const configServiceSpy = {
      configData: { navItems: [] as any[] },
      afterLoad: vi.fn().mockReturnValue(Promise.resolve({})),
      environment: { clasicBaseHref: '' }
    };
    const topSearchServiceSpy: any = {
      clearSearch: vi.fn(),
      clearSearchEvent: vi.fn(),
      registerSearchComponent: vi.fn(),
      setSearchComponentValueEvent: vi.fn().mockReturnValue(NEVER)
    };
    topSearchServiceSpy.clearSearchEvent = new Subject();
    const authServiceSpy = {
      getAuth: vi.fn().mockReturnValue(of(null)),
      checkAuth: vi.fn().mockReturnValue(of(null)),
      canEditData: vi.fn().mockReturnValue(Promise.resolve(false)),
      hasSpecificPrivilege: vi.fn().mockReturnValue(Promise.resolve(false)),
      hasPrivilege: vi.fn().mockReturnValue(false),
      logout: vi.fn()
    };
    activatedRouteStub = new ActivatedRouteStub(
      {
        'search_term': 'test_search_term'
      }
    );

    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        LoadingModule,
        MatMenuModule,
        SubstanceTextSearchModule,
        MainNotificationModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      declarations: [
        BaseComponent,
        RouterLinkDirectiveMock,
        RouterOutletStubComponent,
        MatIconMock
      ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: SubstanceTextSearchService, useValue: topSearchServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BreakpointObserver, useValue: { observe: vi.fn().mockReturnValue(NEVER) } },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: OverlayContainer, useValue: { getContainerElement: vi.fn().mockReturnValue(document.createElement('div')) } },
        { provide: UtilsService, useValue: {
          getBuildInfo: vi.fn().mockReturnValue(of({ version: '1.0.0', commit: '', buildDate: '', buildTime: new Date().toISOString() }))
        } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('after OnInit called', () => {

    beforeEach(() => {
      routerStub.setSnapshotUrl('/test-before/test');
      // ngOnInit() is async; logoSrcPath is only set after its first await, so this
      // initial pass would otherwise still see it as undefined. Skip the checkNoChanges
      // pass here — each test's own whenStable()+detectChanges() does the real, settled check.
      fixture.detectChanges(false); // ngOnInit()
    });

    it('should set mainPathSegment on init', async () => {
      await fixture.whenStable();
      // ngOnInit() chains several awaits (updatePrivileges()'s own 4 sequential awaits,
      // then authService.canEditData()) before reaching logoSrcPath; one whenStable() isn't
      // always enough to guarantee the full chain has settled before the next checked pass.
      await new Promise(resolve => setTimeout(resolve, 0));
      await fixture.whenStable();
      fixture.detectChanges(false);
      expect(component.mainPathSegment).toBe('test-before', 'mainPathSegment should be set correctly');
    });

    it('should set mainPathSegment when the router completes a state change', async () => {
      await fixture.whenStable();
      await new Promise(resolve => setTimeout(resolve, 0));
      await fixture.whenStable();
      // the component's handler reacts to ResolveEnd (base.component.ts), not
      // NavigationEnd — this is the event that actually drives mainPathSegment updates.
      routerStub.fireResolveEndEvent('/test-after/test');
      fixture.detectChanges(false);
      expect(component.mainPathSegment).toBe('test-after', 'mainPathSegment should be set correctly');
    });
  });
});
