import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppNotification } from './notification.model';

@Injectable()
export class MainNotificationService {
  notificationEvent: Subject<AppNotification> = new Subject();

  constructor() { }

  setNotification(notification: AppNotification): void {
    this.notificationEvent.next(notification);
  }
}
