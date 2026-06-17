import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { isString } from 'util';
import { IfStmt } from '@angular/compiler';
import { AuthService, Auth } from '@gsrs-core/auth';
import { take } from 'rxjs/operators';
import { AssignableRole, UserEditObject } from '@gsrs-core/admin/admin-objects.model';
import { Router } from '@angular/router';
import { ConfigService } from "../../../config/config.service";

@Component({
    selector: 'app-user-edit-dialog',
    templateUrl: './user-edit-dialog.component.html',
    styleUrls: ['./user-edit-dialog.component.scss'],
    standalone: false
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
  availableRoleNames: string[];
  assignableRoles: AssignableRole[];
  selectedRole: string;

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
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private configService: ConfigService,
  ) {
    this.user = data.user;
    this.userID = data.userID;
    this.submitted = data.submission;
    this.userLoggedIn = this.authService.getUser();
    }

    async ngOnInit() {
      if (this.user) {
        if(!await this.authService.hasSpecificPrivilege('Manage Users')) {
          alert("Sorry! Unable to verify that you have the privileges to access this page");
          this.router.navigateByUrl('/home');
       }
        this.checkRoles();
        this.originalName = this.user.username;
        this.loading = false;
        this.newUser = false;
        this.userHasAdminRole = this.checkIfUserHasAdminRole(this.user.roles);
          this.adminService.getGroups().pipe(take(1)).subscribe( response => {
            this.setupAssignableRoles();
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
            
            this.setupAssignableRoles();

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
        this.assignableRoles = [];
        this.adminService.getAllAvailableRoles().subscribe(roleNames => {
          this.availableRoleNames = roleNames;
           this.availableRoleNames.forEach(r=>{
            let newRole = {roleName: r, assigned: false };
            this.assignableRoles.push(newRole);
           })
        });

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
      if(role.role && role.role.toLowerCase() === 'admin') {
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

  private isValidEmail(email: string): boolean {
    if (!email || email.trim() === '') return true; // email is optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  saveChanges(): void {
    if (this.user.user.email && !this.isValidEmail(this.user.user.email)) {
      this.isError = true;
      this.message = 'Email format is incorrect';
      return;
    } else if (this.changePassword && this.newPassword !== '' ) {
      this.isError = true;
      this.message = 'Cancel or submit new password to save other changes';
    } else if(!this.selectedRole || this.selectedRole===null || this.selectedRole.length ===0){
        this.message = "Please select a role for this user";
        return;
    } else {
      this.isError = false;
      const rolesArr = [this.selectedRole];
      const groups = [];
      this.groups.forEach(group => {
        if (group.hasGroup ) {
          groups.push(group.name);

        }
      });

      if(!this.selectedRole || this.selectedRole===null || this.selectedRole.length ===0){
        this.message = "Please select a role for this user";
        return;
      }

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
        this.message = error.error.message || error.message || 'Unable to edit user';
      }
    });
  }

  addUser(): void {
    this.isError = false;
    if (this.user.user.email && !this.isValidEmail(this.user.user.email)) {
      this.isError = true;
      this.message = 'Email format is incorrect';
      return;
    }
    if (this.newPassword === this.newPasswordConfirm) {
      if(!this.selectedRole || this.selectedRole===null || this.selectedRole.length ===0){
        this.message = "Please select a role for this user";
        return;
      }

      const rolesArr = [this.selectedRole];
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
        this.message = '';
        if (response && response.user) {
          this.successfulChange(response);
        }
      }, error => {
        if (error.error) {
          this.isError = true;
          this.message = 'ERROR: ';
          let dummytext = 'This user either already exists or there was a server problem updating the record';
          this.message += error.error.message === undefined ?
          dummytext : error.error.message.split(':')[1];
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
        this.adminService.changeMyPassword('', this.newPassword).pipe(take(1)).subscribe(response => {
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

  private userHasRole(roleTest: string): boolean {
    if( this.user == null) return true;
    let roleToCompare =roleTest.toLocaleLowerCase();
    for(var r in this.user.roles) {
      let role = this.user.roles[r].role;
      if( roleToCompare === role.toLocaleLowerCase()) {
        return true;
      }
    }
    return false;
  }

  private getRoleNumericValue(roleName: string): number {
    if(!roleName || roleName === null || roleName.length === 0 ) return
    (this.configService.configData.roleSortingConfig && this.configService.configData.roleSortingConfig["null"] != null )
    ? this.configService.configData.roleSortingConfig["null"] : 0;

    let roleUpper = roleName?.toUpperCase();
    if (roleUpper && this.configService.configData?.roleSortingConfig 
      && Object.hasOwn(this.configService.configData.roleSortingConfig, roleUpper)) {
      return this.configService.configData.roleSortingConfig[roleName.toUpperCase()];
    }
    return 1;
  }

  private setupAssignableRoles() {
    this.assignableRoles = [];
    this.adminService.getAllAvailableRoles().subscribe(roleNames => {
      this.availableRoleNames = roleNames;
      this.availableRoleNames.forEach(r=>{
        let hasRole:boolean = this.userHasRole(r);
        let newRole = {roleName: r, assigned: hasRole };
        this.assignableRoles.push(newRole);
      });
      this.assignableRoles.sort( (role1: AssignableRole,  role2: AssignableRole )=> {
        return this.getRoleNumericValue(role2.roleName) - this.getRoleNumericValue(role1.roleName); 
      });
      this.selectedRole = this.getHighestPriorityRole();
     });
   }

  getHighestPriorityRole(): string {
    if(! this.user.roles || this.user.roles === null || this.user.roles.length ===0) {
      return '';
    }
    let selectedRoleName= this.user.roles.reduce((highest, role) => 
      this.getRoleNumericValue(role.role) > this.getRoleNumericValue(highest.role) 
        ? role 
        : highest
    ).role;
    return selectedRoleName;
  }

}
