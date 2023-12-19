import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from  '@angular/material/dialog';
import { ConfigService, SessionExpirationWarning } from '@gsrs-core/config';

@Component({
  selector: 'app-session-expiration-dialog',
  templateUrl: './session-expiration-dialog.component.html',
  styleUrls: ['./session-expiration-dialog.component.scss']
})
export class SessionExpirationDialogComponent implements OnInit {
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
    private http: HttpClient
  ) {
    this.sessionExpirationWarning = data.sessionExpirationWarning;
    this.sessionExpiringAt = data.sessionExpiringAt;
  }

  ngOnInit() {
    // If SessionExpirationWarning is not found in configData, the intervals are never set
    // and this component is inert
    this.updateDialogInterval = setInterval(() => { this.updateDialog(); });
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
      const reminaingSeconds = String(this.timeRemainingSeconds % 60).padStart(2, '0');
      this.dialogTitle = "Session Ending Soon"
      this.dialogMessage = `You will be logged out in ${remainingMinutes}:${reminaingSeconds}`
    }
    else {
      this.dialogTitle = "Session Ended"
      this.dialogMessage = "Your session has expired, please login again."
    }
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
      err => { console.log("Error extending session: ", err) },
      () => { }
    );
  }

  login() {
    window.location.assign('/login');
  }
}
