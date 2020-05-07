import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from '@gsrs-core/admin/admin.service';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit {
  user: any;
  userID: any;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
  changePassword: boolean = false;
  loading: boolean = true;
  roles = [{name:'Updater', hasRole: false}, {name:'Admin', hasRole: false},{name: 'Query', hasRole: false}, {name:'SuperUpdate', hasRole: false}, {name:'DataEntry', hasRole: false}, {name:'SuperDataEntry', hasRole: false}, {name:'Approver', hasRole: false}];
  constructor(
    private adminService: AdminService,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
    this.userID = data.userID;
    }

  ngOnInit() {
    if (this.userID){
        this.adminService.getUserByName(this.userID).subscribe( resp =>{
          console.log(resp);
          this.user = resp;
          this.loading = false;
          this.checkRoles();
        })
    } else {
      this.loading = false;
    }
    
  }

  hasRole(role:string): boolean {
    let has = false;
    this.user.roles.forEach(element => {
      console.log(element);
      if (element === role) {
        has = true;
      }
    });
    console.log(has);
    return has;
  }
  checkRoles() {
    this.roles.forEach(role =>{
      this.user.roles.forEach(element => {
        console.log(element + '-' + role.name);
        if (element === role.name) {
          console.log('found');
          role.hasRole = true;
        }
    });
  });
  }


  validatePassword(){
    console.log(this.newPassword === this.newPasswordConfirm);
    if (this.newPassword !== this.newPasswordConfirm) {
      alert('passwords do not match');
      this.newPassword = "";
      this.newPasswordConfirm = "";
    }
  }

}
