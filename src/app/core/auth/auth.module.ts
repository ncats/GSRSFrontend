import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileComponent } from '@gsrs-core/auth/user-profile/user-profile.component';
import { DownloadMonitorComponent } from '@gsrs-core/auth/user-downloads/download-monitor/download-monitor.component';
import { UserDownloadsComponent } from '@gsrs-core/auth/user-downloads/user-downloads.component';
import { MatProgressSpinnerModule, MatDialogModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { DecodeUriPipe } from '@gsrs-core/auth/user-downloads/download-monitor/decodeURI.pipe';
import { FileSizePipe } from '@gsrs-core/auth/user-downloads/download-monitor/fileSize.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SessionExpirationComponent } from './session-expiration/session-expiration.component';
import { SessionExpirationDialogComponent } from './session-expiration/session-expiration-dialog/session-expiration-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    LoginComponent,
    UserProfileComponent,
    UserDownloadsComponent,
    DownloadMonitorComponent,
    SessionExpirationComponent,
    SessionExpirationDialogComponent,
    DecodeUriPipe,
    FileSizePipe
  ],
  entryComponents: [
    SessionExpirationDialogComponent
  ],
  exports: [
    LoginComponent,
    UserProfileComponent,
    DownloadMonitorComponent,
    SessionExpirationComponent,
    UserDownloadsComponent
  ]
})
export class AuthModule { }
