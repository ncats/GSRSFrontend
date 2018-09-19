import { Component, OnInit, ViewChild } from '@angular/core';
import { MainNotificationService } from '../main-notification.service';
import { AppNotification, NotificationType } from '../notification.model';

@Component({
  selector: 'app-main-notification',
  templateUrl: './main-notification.component.html',
  styleUrls: ['./main-notification.component.scss']
})
export class MainNotificationComponent implements OnInit {
  @ViewChild('notification') appNotification: { nativeElement: HTMLElement };
  private notificationTimer: any;
  private notifcationType: NotificationType;
  public notiricationMessage: string;

  constructor(
    private notificationService: MainNotificationService
  ) { }

  ngOnInit() {
    this.appNotification.nativeElement.classList.add('hidden');
    this.notificationService.notificationEvent.subscribe(notification => {
      this.setNotification(notification);
    });
  }

  setNotification(notification: AppNotification): void {
    this.notifcationType = notification.type || NotificationType.default;
    this.notiricationMessage = notification.message;
    this.appNotification.nativeElement.classList.remove('hidden');
    this.appNotification.nativeElement.classList.add(NotificationType[this.notifcationType]);
    this.appNotification.nativeElement.classList.add('showing');
    const timeout = notification.milisecondsToShow || 5000;
    this.notificationTimer = setTimeout(() => {
      this.removeNotification(notification.type);
      this.notificationTimer = null;
    }, timeout);
  }

  removeNotification(notificationType: NotificationType): void {
    if (this.notificationTimer != null) {
      clearTimeout(this.notificationTimer);
    }
    this.appNotification.nativeElement.classList.remove('showing');
    this.appNotification.nativeElement.classList.add('hidden');
    this.appNotification.nativeElement.classList.remove(NotificationType[this.notifcationType]);
  }

}
