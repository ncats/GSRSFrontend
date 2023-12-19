import { Router, Event as NavigationEvent, NavigationStart } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';

import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { ConfigService, SessionExpirationWarning } from '@gsrs-core/config';
import { AuthService } from '../auth.service';
import { SessionExpirationDialogComponent } from './session-expiration-dialog/session-expiration-dialog.component'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-session-expiration',
  templateUrl: './session-expiration.component.html'
})
export class SessionExpirationComponent implements OnInit {
  sessionExpirationWarning: SessionExpirationWarning = null;
  sessionExpiringAt: number;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];
  private expirationTimer: any;

  constructor(
    private router: Router,
    private configService: ConfigService,
    private authService: AuthService,
    private http: HttpClient,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer
  ) {
    this.sessionExpirationWarning = configService.configData.sessionExpirationWarning;
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngOnInit() {
    // If SessionExpirationWarning is not found in configData, the intervals are never set
    // and this component is inert
    const authSubscription = this.authService.getAuth().subscribe(auth => {
      if (this.sessionExpirationWarning) {
        if (auth) {
          this.resetExpirationTimer();
        }
        else {
          // User has logged out while timeout is active
          this.clearExpirationTimer();
        }
      }
    });
    this.subscriptions.push(authSubscription);

    // This component seems to be destroyed and recreated on route change, so maybe
    // the following isn't necessary:
    // const routerSubscription = this.router.events.subscribe((event: NavigationEvent) => {
    //   if (event instanceof NavigationStart && this.expirationTimer) {
    //     this.extendSession();
    //   }
    // });
    // this.subscriptions.push(routerSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.clearExpirationTimer();
  }

  getCurrentTime() {
    return Math.floor((new Date()).getTime() / 1000);
  }

  clearExpirationTimer() {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }
  }

  resetExpirationTimer() {
    this.clearExpirationTimer();

    const currentTime = this.getCurrentTime()
    this.sessionExpiringAt = currentTime + this.sessionExpirationWarning.maxSessionDurationMinutes * 60;

    const timeRemainingSeconds = this.sessionExpiringAt - currentTime;
    const timeBeforeDisplayingDialogMs = (timeRemainingSeconds - 61) * 1000;
    if (timeBeforeDisplayingDialogMs > 0) {
      this.expirationTimer = setTimeout( () => {
        this.openDialog();
      }, timeBeforeDisplayingDialogMs);
    }
    else {
      this.login();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(SessionExpirationDialogComponent, {
      data: {
        'sessionExpirationWarning': this.sessionExpirationWarning,
        'sessionExpiringAt': this.sessionExpiringAt
      },
      width: '650px',
      autoFocus: false,
      disableClose: true
    });
    this.overlayContainer.style.zIndex = '1501';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response) {
        // Session was extended
        this.resetExpirationTimer();
      }
    });
  }

  extendSession() {
    const url = this.sessionExpirationWarning.extendSessionApiUrl;
    this.http.get(url).subscribe(
      data => {
        this.resetExpirationTimer();
      },
      err => { console.log("Error extending session: ", err) },
      () => { }
    );
  }

  login() {
    window.location.assign('/login');
  }
}
