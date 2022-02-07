import { Component, OnInit } from '@angular/core';
import { Auth } from '@gsrs-core/auth/auth.model';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import { isString } from 'util';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: Auth;
  newPassword = '';
  oldPassword = '';
  newPasswordConfirm = '';
  changePassword = false;
  message = '';
  loading = false;
  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    public dialogRef: MatDialogRef<UserProfileComponent>,
  ) { }

  ngOnInit() {
    this.authService.getAuth().pipe(take(1)).subscribe( response => {
      this.user = response;
    });
  }

  viewDownloads(): void {
    this.router.navigate(['/user-downloads']);
    setTimeout(() => {
      this.dialogRef.close();
    }, 400);
  }

  validatePassword(): void {
    if (this.newPassword !== this.newPasswordConfirm) {
      this.message = 'Error: passwords do not match';
      this.newPassword = '';
      this.newPasswordConfirm = '';
    } else if (this.newPassword === this.oldPassword) {
      this.message = 'Error: no change in password detected';
    } else {
      this.loading = true;
        this.adminService.changeMyPassword(this.oldPassword, this.newPassword, this.user.id).pipe(take(1)).subscribe(response => {
          this.message = 'Password updated successfully!';
          this.loading = false;
          this.newPassword = '';
          this.newPasswordConfirm = '';
          this.oldPassword = '';
          this.changePassword = false;
        }, error => {
          this.loading = false;
          if (error.error && isString(error.error) ) {
            this.message = 'Error - ' + error.error;
          } else {
            this.newPassword = '';
            this.newPasswordConfirm = '';
            this.changePassword = !this.changePassword;
            this.message = 'Error: unknown error';
          }
        });
  }

}
}
