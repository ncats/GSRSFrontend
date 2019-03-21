import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from './base.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoadingModule } from '../loading/loading.module';
import { RouterStub } from '../../testing/router-stub';
import { RouterLinkDirectiveMock } from '../../testing/router-link-mock.directive';
import { MatMenuModule } from '@angular/material/menu';
import { TopSearchModule } from '../top-search/top-search.module';
import { MainNotificationModule } from '../main-notification/main-notification.module';
import { ConfigService } from '../config/config.service';
import { TopSearchService } from '../top-search/top-search.service';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { RouterOutletStubComponent } from '../../testing/router-outlet-mock.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { MatIconMock } from '../../testing/mat-icon-mock.component';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;
  let routerStub: RouterStub;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async(() => {
    routerStub = new RouterStub();
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    const topSearchServiceSpy = jasmine.createSpyObj('TopSearchService', ['clearSearch', 'clearSearchEvent']);
    topSearchServiceSpy.clearSearchEvent = new Subject();
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
        TopSearchModule,
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
        { provide: TopSearchService, useValue: topSearchServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    })
    .compileComponents();
  }));

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
      fixture.detectChanges(); // ngOnInit()
    });

    it('should set mainPathSegment on init', async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.mainPathSegment).toBe('test-before', 'mainPathSegment should be set correctly');
      });
    }));

    it('should set mainPathSegment when the router completes a state change', async(() => {
      fixture.whenStable().then(() => {
        routerStub.fireNavigationEndEvent('/test-after/test');
        fixture.detectChanges();
        expect(component.mainPathSegment).toBe('test-after', 'mainPathSegment should be set correctly');
      });
    }));
  });
});
