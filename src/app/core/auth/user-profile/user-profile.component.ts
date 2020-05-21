import { Component, OnInit } from '@angular/core';
import { Auth } from '@gsrs-core/auth/auth.model';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import { isString } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: Auth;
  newPassword: string = '';
  oldPassword: string = '';
  newPasswordConfirm: string = '';
  changePassword = false;
  message: string = '';
  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe( response => {
      this.user = response;
      console.log(response);
    })
  }

  viewDownloads(): void {
    this.router.navigate(['/user-downloads']);
    setTimeout(() => {})
  }

  validatePassword(): void{
    if (this.newPassword !== this.newPasswordConfirm) {
      this.message = 'Error: passwords do not match';
      this.newPassword = "";
      this.newPasswordConfirm = "";
    } else if (this.newPassword === this.oldPassword) {
      this.message = 'Error: no change in password detected';
    } else {
        this.adminService.changeMyPassword(this.oldPassword, this.newPassword, this.user.id).pipe(take(1)).subscribe(response => {
          this.changePassword = !this.changePassword;
          this.message = "Password updated successfully";
        }, error => {
          if (error.error && isString(error.error) ) {
            this.message = "Error - " + error.error;
          } else {
            this.newPassword = "";
            this.newPasswordConfirm = "";
            this.changePassword = !this.changePassword;
            this.message = "Error: updated successfully";
          }
        });
  }

}
}
