import { Component, OnInit } from '@angular/core';
import { User, Auth } from '@gsrs-core/auth';
import { MatDialog, Sort } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UserEditDialogComponent } from '@gsrs-core/admin/user-management/user-edit-dialog/user-edit-dialog.component';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { UtilsService } from '@gsrs-core/utils';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  userID: number;
  alert: string;
  filtered: any;
  loading: boolean = false;
  showAll: boolean = false;
  private overlayContainer: HTMLElement;
  displayedColumns: string[] = ["name", 'active', 'email', 'created', 'modified'];
users: Array<any> = [];
  constructor(
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private adminService: AdminService,
    private utilsService: UtilsService

  ) { }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  

}

showAllUsers() {
  this.loading = true;
  this.showAll = true;
  this.adminService.getAllUsers().subscribe(response => {
    this.users = response;
    this.filtered = response;
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

  editUser(user: any, index: number): void {
    console.log(user);
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: {'userID': user},
      width: '800px'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response ) {
        console.log(response);
          const backup = this.filtered;
          backup[index] = response;
          this.filtered = backup;
      }
    });
  }

  addUser(user: any) {
    console.log(user);
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: {'type': 'add'},
      width: '800px'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response ) {

        this.filtered = this.filtered.push(response);
      }
    });
  }

  sortData(sort: Sort) {
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.filtered = data;
      return;
    }
    this.filtered = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name' : return this.utilsService.compare(a.user.username.toUpperCase(), b.user.username.toUpperCase(), isAsc);
        case 'active' : return this.utilsService.compare(a.active, b.user.active, isAsc);
        case 'email' :return this.utilsService.compare(a.user.email || '', b.user.email || '', isAsc);
        case 'modified' :return this.utilsService.compare(a.modified, b.modified, isAsc);
        case 'created' :return this.utilsService.compare(a.created, b.created, isAsc);
      }
    });
    console.log(sort);
    console.log(this.filtered);
  }

}
