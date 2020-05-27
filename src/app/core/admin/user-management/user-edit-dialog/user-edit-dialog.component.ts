import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
  user: any;
  userID: string;
  oldPassword: string;
  originalName: string;
  newPassword: string;
  newUser = false;
  newPasswordConfirm: string;
  changePassword = false;
  loading = true;
  message: string;
  newGroup: string;
  groups: Array< any >;
  roles = [{name: 'Updater', hasRole: false},
    {name: 'Admin', hasRole: false},
    {name: 'Query', hasRole: false},
    {name: 'SuperUpdate', hasRole: false},
    {name: 'DataEntry', hasRole: false},
    {name: 'SuperDataEntry', hasRole: false},
    {name: 'Approver', hasRole: false}];
  constructor(
    private adminService: AdminService,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
    this.userID = data.userID;
    }

    ngOnInit() {
      if (this.user) {
        this.checkRoles();
        this.originalName = this.user.username;
        this.loading = false;
        this.newUser = false;
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
          this.adminService.getUserByName(this.userID).pipe(take(1)).subscribe( resp => {
            this.user = resp;
            this.checkRoles();
            this.originalName = resp.user.username;
            this.loading = false;
            this.newUser = false;
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
        this.user = {groups: [], roles: [],  user: {}};
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
      this.message = 'Cancel or submit new password to save other changes';
    } else {
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
    const userEditObj: UserEditObject = {
      'username': this.user.user.username,
      'isAdmin': this.user.user.admin,
        'isActive': this.user.active,
        'email': this.user.user.email || null,
        'roles': rolesArr,
        'groups' : groups,
    };

    this.adminService.editUser(userEditObj, this.originalName).pipe(take(1)).subscribe(response => {
      if (response && response.user) {
        this.dialogRef.close(response);
      } else {
        this.message = 'Unable to edit user';
      }
    }, error => {
      this.message = 'Unable to edit user';
      if (error.error && isString(error.error) ) {
        this.message = error;
      }
    });
  }
  }

  addUser(): void {
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
      const userEditObj: UserEditObject = {
        'username': this.user.user.username,
        'isAdmin': this.user.user.admin,
        'isActive': this.user.active,
        'email': this.user.user.email || null,
        'roles': rolesArr,
        'groups' : ['testGroup'],
        'password': this.newPassword
      };

      this.adminService.addUser(userEditObj).pipe(take(1)).subscribe(response => {
        if (response && response.user) {
          this.dialogRef.close(response);
        }
      }, error => {
        if (error.error && isString(error.error) ) {
          this.message = error.error;
        }
      });
    } else {
      this.message = 'passwords do not match';
    }
  }

  validatePassword(): void {
    if (this.newPassword !== this.newPasswordConfirm) {
      this.message = 'Error: passwords do not match';
      this.newPassword = '';
      this.newPasswordConfirm = '';
    } else if (this.newPassword === this.oldPassword) {
      this.message = 'Error: no change in password detected';
    } else {
      if ( this.authService.getUser === this.user.identifier ) {
        this.adminService.changeMyPassword(this.oldPassword, this.newPassword, this.user.id).pipe(take(1)).subscribe(response => {
          this.changePassword = !this.changePassword;
          this.message = 'Password updated successfully';
        }, error => {
          if (error.error && isString(error.error) ) {
            this.message = 'Error - ' + error.error;
          } else {
            this.newPassword = '';
            this.newPasswordConfirm = '';
            this.changePassword = !this.changePassword;
            this.message = 'Error: updated successfully';
          }
        });
      } else {
        this.adminService.changePassword(this.oldPassword, this.newPassword, this.user.id).pipe(take(1)).subscribe(response => {
          this.changePassword = !this.changePassword;
          this.message = 'Password updated successfully';
        }, error => {
          if (error.error && isString(error.error) ) {
            this.message = 'Error - ' + error.error;
          } else {
            this.newPassword = '';
            this.newPasswordConfirm = '';
            this.changePassword = !this.changePassword;
            this.message = 'Error: updated successfully';
          }
        });
      }
    }
  }

}
