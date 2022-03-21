import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { isString } from 'util';
import { IfStmt } from '@angular/compiler';
import { AuthService, Auth } from '@gsrs-core/auth';
import { take } from 'rxjs/operators';
import { UserEditObject } from '@gsrs-core/admin/admin-objects.model';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit {
  userLoggedIn: any;
  user: any;
  userID: string;
  userHasAdminRole: boolean;
  originalName: string;
  newPassword: string;
  newUser = false;
  newPasswordConfirm: string;
  changePassword = false;
  loading = true;
  message: string;
  newGroup = '';
  groups: Array< any >;
  submitted = false;
  response: any;
  isError: boolean = false;
  roles = [
    {name: 'Query', hasRole: false},
    {name: 'DataEntry', hasRole: false},
    {name: 'SuperDataEntry', hasRole: false},
    {name: 'Updater', hasRole: false},
    {name: 'SuperUpdate', hasRole: false},
    {name: 'Approver', hasRole: false},
    {name: 'Admin', hasRole: false}];
  constructor(
    private adminService: AdminService,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
    this.userID = data.userID;
    this.submitted = data.submission;
    this.userLoggedIn = this.authService.getUser();
    }

    ngOnInit() {
      if (this.user) {
        this.checkRoles();
        this.originalName = this.user.username;
        this.loading = false;
        this.newUser = false;
        this.userHasAdminRole = this.checkIfUserHasAdminRole(this.user.roles);
          this.adminService.getGroups().pipe(take(1)).subscribe( response => {
            this.groups = [];
            response.forEach( grp => {
              const temp = {name: grp, hasGroup: false};
              this.user.groups.forEach(element => {
                if (element.name === grp) {
                    temp.hasGroup = true;
                  }
              });
              this.groups.push(temp);
            });
          });
      } else if (this.userID) {
          this.adminService.getUserByID(this.userID).pipe(take(1)).subscribe( resp => {
            this.user = resp;
            this.checkRoles();
            this.originalName = resp.user.username;
            this.loading = false;
            this.newUser = false;
            this.userHasAdminRole = this.checkIfUserHasAdminRole(this.user.roles);
            this.adminService.getGroups().pipe(take(1)).subscribe( response => {
              this.groups = [];
              response.forEach( grp => {
                const temp = {name: grp, hasGroup: false};
                this.user.groups.forEach(element => {
                  if (element.name === grp) {
                      temp.hasGroup = true;
                    }
                });
                this.groups.push(temp);
              });
            });
          });
      } else {
        this.newUser = true;
        this.userHasAdminRole = false;
        this.user = {groups: [], roles: [],  user: {}};
        this.user.active = true;
        this.loading = false;
        this.adminService.getGroups().pipe(take(1)).subscribe( response => {
          this.groups = [];
          response.forEach( grp => {
            const temp = {name: grp, hasGroup: false};
            this.groups.push(temp);
          });
        });
      }
    }

  checkRoles(): void {
    this.roles.forEach(role => {
      this.user.roles.forEach(element => {
        if (element === role.name) {
          role.hasRole = true;
        }
    });
  });
  }

  checkIfUserHasAdminRole(roles): boolean {
    let toReturn = false;
    roles.forEach(role => {
      if(role.toLowerCase() === 'admin') {
        toReturn = true;
      }
    });
    return toReturn;
  }

  checkGroups(): void {
    this.groups.forEach(group => {
      this.user.groups.forEach(element => {
        if (element.name === group.name) {
          group.hasGroup = true;
        }
    });
  });
  }

  saveChanges(): void {
    if (this.changePassword && this.newPassword !== '' ) {
      this.isError = true;
      this.message = 'Cancel or submit new password to save other changes';
    } else {
      this.isError = false;
      const rolesArr = [];
      this.roles.forEach(role => {
        if (role.hasRole) {
          rolesArr.push(role.name);
        }
      });
      const groups = [];
      this.groups.forEach(group => {
        if (group.hasGroup ) {
          groups.push(group.name);

        }
      });

      if (this.newGroup && this.newGroup !== '') {
        groups.push(this.newGroup);
      }
      const userEditObj: UserEditObject = {
        username: this.user.user.username,
        isAdmin: this.user.user.admin,
        isActive: this.user.active,
        email: this.user.user.email || null,
        roles: rolesArr,
        groups: groups
      };

      if(this.userLoggedIn === this.user.user.username) { // if userLoggedIn is making changes to their account
        if((this.userHasAdminRole !== this.checkIfUserHasAdminRole(rolesArr))
        || !this.user.active) { // user is trying to remove their admin role or make themselves inactive
          if (confirm('Setting your own account as inactive or removing admin role are significant changes. ARE YOU SURE YOU WANT TO PROCEED?')) {
            this.editUser(userEditObj);
          }
        } else { // safe changes
          this.editUser(userEditObj);
        }
      } else { // not userloggedin's acct
        this.editUser(userEditObj);
      }
    }
  }

  editUser(userEditObj): void {
    this.adminService.editUser(userEditObj, this.userID).pipe(take(1)).subscribe(response => {
      if (response && response.user) {
        this.isError = false;
        this.successfulChange(response);
      } else {
        this.isError = true;
        this.message = 'Unable to edit user';
      }
    }, error => {
      this.isError = true;
      this.message = 'Unable to edit user';
      if (error.error) {
        this.isError = true;
        this.message = error;
      }
    });
  }

  addUser(): void {
    this.isError = false;
    if (this.newPassword === this.newPasswordConfirm) {
      const rolesArr = [];
      this.roles.forEach(role => {
        if (role.hasRole) {
          rolesArr.push(role.name);
        }
      });
      const groups = [];
      this.groups.forEach(group => {
        if (group.hasGroup ) {
          groups.push(group.name);
        }
      });
      if (this.newGroup && this.newGroup !== '') {
        groups.push(this.newGroup);
      }
      const userEditObj: UserEditObject = {
        username: this.user.user.username,
        isAdmin: this.user.user.admin,
        isActive: this.user.active,
        email: this.user.user.email || null,
        roles: rolesArr,
        groups: groups,
        password: this.newPassword
      };

      this.adminService.addUser(userEditObj).pipe(take(1)).subscribe(response => {
        if (response && response.user) {
          this.successfulChange(response);
        }
      }, error => {
        if (error.error) {
          this.isError = true;
          this.message = 'ERROR: ';
          this.message += error.error.message === undefined ?
          error.statusText : error.error.message.split(':')[1];
        }
        this.adminService.getUserByName(this.user.user.username).pipe(take(1)).subscribe(response => {
          let userIsActive = false;
          userIsActive = response.active;
          if(userIsActive) {
            this.message += '. This user is active.';
          } else {
            this.message += '. This user is NOT active.';
          }

        }, err => {
        });
      });
    } else {
      this.isError = true;
      this.message = 'passwords do not match';
    }
  }

  successfulChange(response) {
    this.response = response;
    this.submitted = true;
    setTimeout(() => {
      this.dialogRef.close(this.response);
    }, 300000);
  }

  succesClose() {
    this.dialogRef.close(this.response);
  }

  validatePassword(): void {
    if (this.newPassword !== this.newPasswordConfirm) {
      this.isError = true;
      this.message = 'Error: passwords do not match';
      this.newPassword = '';
      this.newPasswordConfirm = '';
    } else {
      this.isError = false;
      if ( this.authService.getUser === this.user.identifier ) {
        this.adminService.changeMyPassword('', this.newPassword, this.user.id).pipe(take(1)).subscribe(response => {
        this.isError = false;
          this.changePassword = !this.changePassword;
          this.message = 'Password updated successfully';
        }, error => {
          if (error.error) {
            this.isError = true;
            this.message = 'Error - ' + error.error;
          } else {
            this.isError = true;
            this.newPassword = '';
            this.newPasswordConfirm = '';
            this.changePassword = !this.changePassword;
            this.message = 'Error:unknown server error';
          }
        });
      } else {
        this.adminService.changePassword( this.newPassword, this.user.id).pipe(take(1)).subscribe(response => {
          this.changePassword = !this.changePassword;
          this.isError = false;
          this.message = 'Password updated successfully';
        }, error => {
          if (error.error) {
            this.isError = true;
            this.message = 'Error: ' + error.error;
          } else {
            this.isError = true;
            this.newPassword = '';
            this.newPasswordConfirm = '';
            this.changePassword = !this.changePassword;
            this.message = 'Error: unknown server error';
          }
        });
      }
    }
  }
}
