import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MainNotificationService } from '../main-notification.service';
import { AppNotification, NotificationType } from '../notification.model';
import { Subscription } from 'rxjs';
import { ConfigService } from '@gsrs-core/config/config.service';

@Component({
  selector: 'app-main-notification',
  templateUrl: './main-notification.component.html',
  styleUrls: ['./main-notification.component.scss']
})
export class MainNotificationComponent implements OnInit, OnDestroy {
  @ViewChild('notification', { static: true }) appNotification: { nativeElement: HTMLElement };
  private notificationTimer: any;
  private notifcationType: NotificationType;
  public notificationMessage: string;
  private subscriptions: Array<Subscription> = [];
  public showTopBanner:boolean;

  constructor(
    private notificationService: MainNotificationService,
    private configService: ConfigService
  ) { }

  ngOnInit() {

    if(this.configService.configData.showTopBanner === undefined) {
      this.showTopBanner = false;
    } else {
      if(this.configService.configData.showTopBanner === false) { 
        this.showTopBanner = false;
      } else {
        this.showTopBanner = true;
      }
    }
    

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

  setNotification(notification: AppNotification): void {
    this.notifcationType = notification.type || NotificationType.default;
    this.notificationMessage = notification.message;
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
