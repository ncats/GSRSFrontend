import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { isString } from 'util';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit {
  user: any;
  userID: any;
  oldPassword: string;
  originalName: string;
  newPassword: string;
  newUser: boolean = false;
  newPasswordConfirm: string;
  changePassword: boolean = false;
  loading: boolean = true;
  message: string;
  newGroup: string;
  groups: Array<any>;
  roles = [{name:'Updater', hasRole: false},
    {name:'Admin', hasRole: false},
    {name: 'Query', hasRole: false},
    {name:'SuperUpdate', hasRole: false},
    {name:'DataEntry', hasRole: false},
    {name:'SuperDataEntry', hasRole: false},
    {name:'Approver', hasRole: false}];
  constructor(
    private adminService: AdminService,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
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
          this.adminService.getGroups().subscribe( response => {
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
            console.log(this.groups);
          });
      } else if (this.userID){
          this.adminService.getUserByName(this.userID).subscribe( resp =>{
            this.user = resp;
            this.checkRoles();
            this.originalName = resp.user.username;
            this.loading = false;
            this.newUser = false;
            this.adminService.getGroups().subscribe( response => {
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
              console.log(this.groups);
            });
          });
         
      } else {
        this.newUser = true;
        this.user = {groups:[], roles:[],  user:{}};
        this.loading = false;
        this.adminService.getGroups().subscribe( response => {
          this.groups = [];
          response.forEach( grp => {
            const temp = {name: grp, hasGroup: false};
            this.groups.push(temp);
          });
          console.log(this.groups);
        });
      }
    }

  checkRoles() {
    this.roles.forEach(role =>{
      this.user.roles.forEach(element => {
        if (element === role.name) {
          role.hasRole = true;
        }
    });
  });
  }

  checkGroups() {
    this.groups.forEach(group =>{
      this.user.groups.forEach(element => {
        if (element.name === group.name) {
          group.hasGroup = true;
        }
    });
  });
  }

  saveChanges() {
    let rolesArr = [];
    this.roles.forEach(role =>{
      if (role.hasRole) {
        rolesArr.push(role.name);
      }
    });
    let groups = [];
    this.groups.forEach(group => {
      if(group.hasGroup ) {
        groups.push(group.name);

      }
    });
    const userEditObj = {
      'username': this.user.user.username,
      'isAdmin': this.user.user.admin,
        'isActive':this.user.active,
        'email': this.user.user.email || null,
        'roles': rolesArr,
        'groups' : groups,
    }

    this.adminService.editUser(userEditObj, this.originalName).subscribe(response =>{
      console.log(response);
      if (response && response.user){
        this.dialogRef.close(response);
      } else {
        this.message = 'Unable to edit user';
      }
    }, error => {
      this.message = 'Unable to edit user';
      console.log(error);
      if (error.error && isString(error.error) ) {
        this.message = error;
      }
    });
  }

  addUser() {
    if(this.newPassword === this.newPasswordConfirm){
      let rolesArr = [];
      this.roles.forEach(role =>{
        if (role.hasRole) {
          rolesArr.push(role.name);
        }
      });
      let groups = [];
      this.groups.forEach(group => {
        if(group.hasGroup ) {
          groups.push(group.name);
  
        }
      });
      const userEditObj = {
        'username': this.user.user.username,
        'isAdmin': this.user.user.admin,
        'isActive':this.user.active,
        'email': this.user.user.email || null,
        'roles': rolesArr,
        'groups' : ['testGroup'],
        'password': this.newPassword
      }
  
      this.adminService.addUser(userEditObj).subscribe(response =>{
        if(response && response.user){
          this.dialogRef.close(response);
        }
      }, error => {
        console.log(error);
        if (error.error && isString(error.error) ) {
          this.message = error;
        }

      });
    } else {
      this.message = "passwords do not match";
    }
  }

  validatePassword(){
    console.log(this.newPassword === this.newPasswordConfirm);
    if (this.newPassword !== this.newPasswordConfirm) {
      alert('passwords do not match');
      this.newPassword = "";
      this.newPasswordConfirm = "";
    } else {
      this.adminService.changePassword(this.oldPassword, this.newPassword, this.user.id).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
        if (error.error && isString(error.error) ) {
          this.message = error;
        } else {
    
        }
      })
    }
  }

}
