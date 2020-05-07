import { Component, OnInit } from '@angular/core';
import { User, Auth } from '@gsrs-core/auth';
import { MatDialog } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UserEditDialogComponent } from '@gsrs-core/admin/user-management/user-edit-dialog/user-edit-dialog.component';
import { AdminService } from '@gsrs-core/admin/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  userID: number;
  alert: string;
  loading: boolean = false;
  showAll: boolean = false;
  private overlayContainer: HTMLElement;
  displayedColumns: string[] = ["name", 'active', 'email', 'created', 'modified'];
users: Array<any> = [];
  constructor(
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private adminService: AdminService

  ) { }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  

}

showAllUsers() {
  this.loading = true;
  this.showAll = true;
  this.adminService.getAllUsers().subscribe(response => {
    this.users = response;
    console.log(response);
    this.loading = false;

  });

}

editUserByName(name: any) {
  console.log(name);
  this.loading = true;
  this.alert = "";
  this.adminService.getUserByName(name).subscribe(response => {
    this.loading = false;
    if(response && response.user) {
      const dialogRef = this.dialog.open(UserEditDialogComponent, {
        data: {'user': response},
        width: '800px'
      });
      this.overlayContainer.style.zIndex = '1002';
      const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
        this.overlayContainer.style.zIndex = null;
        if (response ) {
        }
      });
    }
    else {
      this.alert = "User Not found";
    }
  }, error=>{
    this.alert = "User Not found";
    this.loading = false;
  });
}

  editUser(user: any) {
    console.log(user);
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: {'userID': user},
      width: '1000px'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response ) {
      }
    });
  }

}
