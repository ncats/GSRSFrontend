import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { ConfigService, SessionExpirationWarning } from '@gsrs-core/config';
import { AuthService } from '../auth.service';
import { SessionExpirationDialogComponent } from './session-expiration-dialog/session-expiration-dialog.component'
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from "@gsrs-core/utils";

@Component({
  selector: 'app-session-expiration',
  templateUrl: './session-expiration.component.html'
})
export class SessionExpirationComponent implements OnInit {
  sessionExpirationWarning: SessionExpirationWarning = null;
  sessionExpiringAt: number;
  private overlayContainer: HTMLElement;
  private refreshInterval: any;
  private activityRefreshInterval: any;
  private userActive: boolean = false;
  private baseHref: string = '/ginas/app/';

  private static instance?: SessionExpirationComponent = undefined;
  private static sessionExpirationCheckInterval = null;

  constructor(
    private router: Router,
    private configService: ConfigService,
    private authService: AuthService,
    private http: HttpClient,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private utilsService: UtilsService
  ) {
    if (SessionExpirationComponent.instance !== undefined) {
      return SessionExpirationComponent.instance;
    }
    this.sessionExpirationWarning = configService.configData.sessionExpirationWarning;
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngOnInit() {
    if (SessionExpirationComponent.instance !== undefined) {
      return;
    }
    SessionExpirationComponent.instance = this;

    const homeBaseUrl = this.configService.configData && this.configService.configData.gsrsHomeBaseUrl || null;
    if (homeBaseUrl) {
      this.baseHref = homeBaseUrl;
    }

    this.startSessionTimeoutInterval();
  }

  setup() {
    this.configService.afterLoad().then(cd => {
      // If enabled in config file, this functionality periodically checks whether there was a user activity (mouse or keyboard) or not
      // In case there was some activity, the session is refreshed (otherwise the session is not refreshed and may eventually expire)
      if (this.configService.configData.sessionRefreshOnActiveUserOnly) {
        const page = document.getElementsByTagName('body')[0];
        page.addEventListener('mousemove', (e) => {
          if (e instanceof MouseEvent) {
            this.userActive = true;
          }
        });
        page.addEventListener('keydown', (e) => {
          if (e instanceof KeyboardEvent) {
            this.userActive = true;
          }
        });
        clearInterval(this.activityRefreshInterval);
        this.activityRefreshInterval = setInterval(() => {
          if (this.userActive) {
            this.refreshSession();
            this.userActive = false;
          }
        }, 10000);
      } else {
        clearInterval(this.refreshInterval);
        this.refreshInterval = setInterval(() => {
          this.refreshSession();
        }, 600000);
      }
    });
  }

  refreshSession(): any {
    fetch(`${this.baseHref || ''}api/v1/whoami?key=${this.utilsService.newUUID()}`)
  }

  startSessionTimeoutInterval() {
    this.authService.getAuth().subscribe(auth => {
      if (auth != null && this.refreshInterval == null) {
        this.setup();
      } else if (auth === null) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    });

    clearInterval(SessionExpirationComponent.sessionExpirationCheckInterval);
    SessionExpirationComponent.sessionExpirationCheckInterval = setInterval(() => {
      this.sessionExpiringAt = this.getSessionExpiredAt();
      const currentTime = this.getCurrentTime();
      const sessionTtl = this.sessionExpiringAt - currentTime;
      // If session is about to expire in less than 60 seconds, show dialog window
      if (sessionTtl > 0 && sessionTtl < 60) {
        if (!this.isDialogOpened()) {
          this.openDialog();
        }
        // Do not automatically (mouse/keyboard event) extend session when the dialog is opened
        clearInterval(this.activityRefreshInterval);
      } else if (this.sessionExpiringAt !== null && sessionTtl > 0) {
        // The session was externally extended (eg. in pfda) -> close the session dialog
        if (this.isDialogOpened()) {
          this.dialog.closeAll();
        }
      }
    }, 5000)
  }

  private getCookie(name: string) {
    const cookieArr = document.cookie.split(';')
    for (let i = 0; i < cookieArr.length; i++) {
      const cookiePair = cookieArr[i].split('=')
      if (name === cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1])
      }
    }
    return null
  }

  private getSessionExpiredAt() {
    const cookie = this.getCookie('sessionExpiredAt')
    if (!cookie) return null
    return parseInt(cookie)
  }

  getCurrentTime() {
    return Math.floor((new Date()).getTime() / 1000);
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
    dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      this.startSessionTimeoutInterval();
    });
  }

  login() {
    window.location.assign('/login');
  }

  isDialogOpened(): boolean {
    return this.dialog.openDialogs.length > 0;
  }
}
