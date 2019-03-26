import { TestBed, inject } from '@angular/core/testing';

import { MainNotificationService } from './main-notification.service';
import { AppNotification, NotificationType } from './notification.model';

describe('MainNotificationService', () => {
  const appNotification: AppNotification = {
    message: 'this is a test',
    type: NotificationType.error,
    milisecondsToShow: 4000
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainNotificationService]
    });
  });

  it('should be created', inject([MainNotificationService], (service: MainNotificationService) => {
    expect(service).toBeTruthy();
  }));

  it('should fire notification event', inject([MainNotificationService], (service: MainNotificationService) => {
    service.notificationEvent.subscribe((notification) => {
      expect(notification.message).toBe('this is a test', 'should set the right message');
      expect(notification.type).toBe(appNotification.type, 'should set the right message');
      expect(notification.milisecondsToShow).toBe(4000, 'should set the right message');
    });
    service.setNotification(appNotification);
  }));
});
