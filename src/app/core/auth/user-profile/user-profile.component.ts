import { Component, OnInit } from '@angular/core';
import { Auth } from '@gsrs-core/auth/auth.model';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import { isString } from 'util';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SubstanceDraftsComponent } from '@gsrs-core/substance-form/substance-drafts/substance-drafts.component';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  /*

  To prevent the change password button from showing add this to the configuration

  "userProfile": {
    "showChangeUserPasswordButton": false
  },

  */

  user: Auth;
  newPassword = '';
  oldPassword = '';
  newPasswordConfirm = '';
  changePassword = false;
  message = '';
  loading = false;
  showChangeUserPasswordButton: boolean;

  constructor(
    public configService: ConfigService,
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    private dialog: MatDialog,

  ) { }

  ngOnInit() {
    this.showChangeUserPasswordButton = this.configService.configData?.userProfile?.showChangeUserPasswordButton;    
    if (!this.showChangeUserPasswordButton && this.showChangeUserPasswordButton===false) {
      this.showChangeUserPasswordButton=false;
    } else { 
      this.showChangeUserPasswordButton=true;
    }
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

viewDrafts(): void {
  const dialogRef = this.dialog.open(SubstanceDraftsComponent, {
    maxHeight: '85%',
    width: '70%',
    data: {profile: true}
  });
 // this.overlayContainer.style.zIndex = '1002';

  dialogRef.afterClosed().subscribe(response => {
 //   this.overlayContainer.style.zIndex = null;


  /*  if (response) {

        const read = response.substance;
          if (response.uuid && response.uuid != 'register'){
           const url = '/substances/' + response.uuid + '/edit?action=import';
          this.router.navigateByUrl(url, { state: { record: response.substance } });
         } else {
           setTimeout(() => {
          //   this.overlayContainer.style.zIndex = null;
             this.router.onSameUrlNavigation = 'reload';
            this.router.navigateByUrl('/substances/register?action=import', { state: { record: response.json } });
 
           }, 1000);
         }
        }*/

  });
}
}
