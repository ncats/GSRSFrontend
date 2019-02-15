import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoreComponent } from './core.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoadingModule } from '../loading/loading.module';
import { RouterStub } from '../../testing/router-stub';
import { RouterLinkDirectiveStub } from '../../testing/router-link-directive-stub';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TopSearchModule } from '../top-search/top-search.module';
import { MainNotificationModule } from '../main-notification/main-notification.module';

describe('CoreComponent', () => {
  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;
  let routerStub: RouterStub;

  beforeEach(async(() => {
    routerStub = new RouterStub();

    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        LoadingModule,
        MatMenuModule,
        MatIconModule,
        TopSearchModule,
        MainNotificationModule
      ],
      declarations: [
        CoreComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: Router, useValue: routerStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreComponent);
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
