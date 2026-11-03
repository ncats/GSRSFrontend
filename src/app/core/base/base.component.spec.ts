import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Directive, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { vi } from 'vitest';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from './base.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterStub } from '../../../testing/router-stub';
import { ConfigService } from '../config/config.service';
import { SubstanceTextSearchService } from '../substance-text-search/substance-text-search.service';
import { ActivatedRouteStub } from '../../../testing/activated-route-stub';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject, NEVER, of } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UtilsService } from '../utils/utils.service';

// BaseComponent is standalone now, so its own @Component.imports (not TestBed's)
// decide what these child selectors resolve to. RouterStub is a minimal hand-rolled
// object, not a real Angular Router, so the real RouterOutlet/RouterLink directives
// (which construct-time-depend on a real Router) would fail here; stub them, plus the
// 3 real child components, the same way structure-search/substances-browse specs do.
@Component({ selector: 'router-outlet', template: '', standalone: true })
class RouterOutletStub {}

@Directive({ selector: '[routerLink]', standalone: true })
class RouterLinkStub {
  @Input('routerLink') linkParams: any;
}

@Component({ selector: 'app-pfda-toolbar', template: '', standalone: true })
class PfdaToolbarStub {}

@Component({ selector: 'app-session-expiration', template: '', standalone: true })
class SessionExpirationStub {}

@Component({ selector: 'app-loading', template: '', standalone: true })
class LoadingStub {}

@Component({ selector: 'app-substance-text-search', template: '', standalone: true })
class SubstanceTextSearchStub {
  @Input() placeholder: any;
  @Input() styling: any;
  @Input() searchValue: any;
  @Input() eventCategory: any;
  @Output() searchPerformed = new EventEmitter<any>();
  @Output() opened = new EventEmitter<any>();
  @Output() closed = new EventEmitter<any>();
}

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
        HttpClientTestingModule,
        NoopAnimationsModule,
        BaseComponent
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
    });

    TestBed.overrideComponent(BaseComponent, {
      set: {
        imports: [
          CommonModule,
          MatToolbarModule,
          MatDividerModule,
          MatIconModule,
          MatMenuModule,
          MatButtonModule,
          MatTooltipModule,
          RouterOutletStub,
          RouterLinkStub,
          PfdaToolbarStub,
          SessionExpirationStub,
          LoadingStub,
          SubstanceTextSearchStub
        ]
      }
    });

    await TestBed.compileComponents();
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
