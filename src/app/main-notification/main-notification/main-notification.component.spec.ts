import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNotificationComponent } from './main-notification.component';
import { MainNotificationService } from '../main-notification.service';
import { Subject } from 'rxjs';
import { AppNotification, NotificationType } from '../notification.model';

describe('MainNotificationComponent', () => {
  let component: MainNotificationComponent;
  let fixture: ComponentFixture<MainNotificationComponent>;
  let notificationServiceStub: Partial<MainNotificationService> | any;
  const appNotification: AppNotification = {
    message: 'this is a test',
    type: NotificationType.error,
    milisecondsToShow: 4000
  };

  beforeEach(async(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    notificationServiceStub = {
      notificationEvent: new Subject(),
      fireNotificationEvent(): void {
        this.notificationEvent.next(appNotification);
      }
    };

    TestBed.configureTestingModule({
      declarations: [ MainNotificationComponent ],
      providers: [
        { provide: MainNotificationService, useValue: notificationServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show notification on notification event and should hide it after set time', async(() => {
    notificationServiceStub.fireNotificationEvent();
    fixture.detectChanges();
    let notificationElement: HTMLElement = fixture.nativeElement.querySelector('.main-notification');
    expect(notificationElement.classList).not.toContain('hidden', 'should have removed hidden css class');
    expect(notificationElement.classList).toContain('showing', 'should have added showing css class');
    expect(notificationElement.classList)
      .toContain(NotificationType[appNotification.type], 'should have added the right css type class');
    expect(component.notificationMessage).toBe('this is a test', 'should show the right message');
    setTimeout(() => {
      notificationElement = fixture.nativeElement.querySelector('.main-notification');
      expect(notificationElement.classList).toContain('hidden', 'should have added showing css class');
      expect(notificationElement.classList).not.toContain('showing', 'should have removed showing css class');
      expect(notificationElement.classList)
        .not.toContain(NotificationType[appNotification.type], 'should have removed the right css type class');
    }, 4001);
  }));
});
