import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppNotification, NotificationType } from './notification.model';

@Injectable()
export class MainNotificationService {
  notificationEvent: Subject<AppNotification> = new Subject();

  constructor() { }

  setNotification(notification: AppNotification): void {
    this.notificationEvent.next(notification);
  }

  setSuccessNotification(message: string, duration?: number): void {
    this.setNotification({
      message: message,
      type: NotificationType.success,
      milisecondsToShow: duration  ? duration : 4000
    })
  }

  setErrorNotification(message: string, duration?: number): void {
    this.setNotification({
      message: message,
      type: NotificationType.error,
      milisecondsToShow: duration ? duration : 0
    })
  }
}
