import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfigService, SessionExpirationWarning } from '@gsrs-core/config';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { AuthService } from '@gsrs-core/auth';
import { concatMap } from "rxjs"

@Component({
    selector: 'app-session-expiration-dialog',
    templateUrl: './session-expiration-dialog.component.html',
    styleUrls: ['./session-expiration-dialog.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionExpirationDialogComponent implements OnInit, OnDestroy {
  sessionExpirationWarning: SessionExpirationWarning = null;
  sessionExpiringAt: number;
  timeRemainingSeconds: number;
  dialogTitle: string;
  dialogMessage: string;
  private updateDialogInterval: any;

  constructor(
    public dialogRef: MatDialogRef<SessionExpirationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // N.B. injected services has to come after data
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    public configService: ConfigService
  ) {
    this.sessionExpirationWarning = data.sessionExpirationWarning;
    this.sessionExpiringAt = data.sessionExpiringAt;
  }

  ngOnInit() {
    // If SessionExpirationWarning is not found in configData, the intervals are never set
    // and this component is inert
    this.updateDialogInterval = setInterval(() => {
      this.updateDialog();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.updateDialogInterval);
  }

  getCurrentTime() {
    return Math.floor((new Date()).getTime() / 1000);
  }

  updateDialog() {
    const currentTime = this.getCurrentTime()
    this.timeRemainingSeconds = this.sessionExpiringAt - currentTime;

    if (this.timeRemainingSeconds > 0) {
      const remainingMinutes = Math.floor(this.timeRemainingSeconds / 60);
      const remainingSeconds = String(this.timeRemainingSeconds % 60).padStart(2, '0');
      this.dialogTitle = "Session Ending Soon"
      this.dialogMessage = `You will be logged out in ${remainingMinutes}:${remainingSeconds}`
    } else {
      this.dialogTitle = "Session Ended"
      this.dialogMessage = "Your session has expired, please login again."
    }
    this.cdr.markForCheck();
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  extendSession() {
    const url = this.sessionExpirationWarning.extendSessionApiUrl;
    this.http.get(url).subscribe(
      data => {
        this.dialogRef.close(true);
      },
      err => {
 console.log("Error extending session: ", err) 
},
      () => { }
    );
  }

  login() {
    if (this.configService.configData.isPfdaVersion) {
      this.authService.pfdaLogin().pipe(
        concatMap(success => {
          if (success) {
            this.closeDialog();
            return this.authService.getAuth();
          }
        })).subscribe();
    } else {
      window.location.assign('/login');
    }
  }

  proceedAsGuest() {
    clearInterval(this.updateDialogInterval);
    this.authService.logout();
    this.closeDialog();
  }
}
