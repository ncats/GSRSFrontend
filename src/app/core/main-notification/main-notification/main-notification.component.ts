import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MainNotificationService } from '../main-notification.service';
import { AppNotification, NotificationType } from '../notification.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-main-notification',
    templateUrl: './main-notification.component.html',
    styleUrls: ['./main-notification.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNotificationComponent implements OnInit, OnDestroy {
  @ViewChild('notification', { static: true }) appNotification: { nativeElement: HTMLElement };
  private notificationTimer: any;
  private notifcationType: NotificationType;
  public notificationMessage: string;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private notificationService: MainNotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.appNotification.nativeElement.classList.add('hidden');
    const subscription = this.notificationService.notificationEvent.subscribe(notification => {
      this.setNotification(notification);
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    clearTimeout(this.notificationTimer);
  }

  // If notification.milisecondsToShow === 0, the notification is permanent (until closed by user)
  setNotification(notification: AppNotification): void {
    this.notifcationType = notification.type || NotificationType.default;
    this.notificationMessage = notification.message;
    this.cdr.markForCheck();
    this.appNotification.nativeElement.classList.remove('hidden');
    this.appNotification.nativeElement.classList.add(NotificationType[this.notifcationType]);
    this.appNotification.nativeElement.classList.add('showing');
    if (notification.milisecondsToShow === 0) {
      if (this.notificationTimer != null) {
        clearTimeout(this.notificationTimer);
      }
      this.notificationTimer = null;
    } else  {
      const timeout = notification.milisecondsToShow || 5000;
      this.notificationTimer = setTimeout(() => {
        this.removeNotification();
        this.notificationTimer = null;
      }, timeout);
    }
  }

  removeNotification(): void {
    if (this.notificationTimer != null) {
      clearTimeout(this.notificationTimer);
    }
    this.appNotification.nativeElement.classList.remove('showing');
    this.appNotification.nativeElement.classList.add('hidden');
    this.appNotification.nativeElement.classList.remove(NotificationType[this.notifcationType]);
  }
}
