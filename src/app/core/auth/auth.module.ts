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
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    LoginComponent,
    UserProfileComponent,
    UserDownloadsComponent,
    DownloadMonitorComponent
  ],
  exports: [
    LoginComponent,
    UserProfileComponent,
    DownloadMonitorComponent,
    UserDownloadsComponent
  ]
})
export class AuthModule { }
