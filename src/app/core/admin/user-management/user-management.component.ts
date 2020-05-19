import { Component, OnInit } from '@angular/core';
import { User, Auth } from '@gsrs-core/auth';
import { MatDialog, Sort, MatTableDataSource } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UserEditDialogComponent } from '@gsrs-core/admin/user-management/user-edit-dialog/user-edit-dialog.component';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { UtilsService } from '@gsrs-core/utils';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  userID: number;
  alert: string;
  filtered = new MatTableDataSource();
  loading: boolean = false;
  showAll: boolean = false;
  showInactive: boolean = false;
  private overlayContainer: HTMLElement;
  displayedColumns: string[] = ["name", 'active', 'email', 'created', 'modified', 'delete'];
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
    this.filtered.data = response;
    this.showInactiveUsers();
    this.loading = false;


  });

}

showInactiveUsers() {
  this.showInactive = !this.showInactive;
  if (this.showInactive) {
    const backup = [];
    this.users.forEach(user => {
      if (user.active) {
        backup.push(user);
      }
    });
    this.filtered.data = backup;

  } else {
    this.filtered.data = this.users;
  }
}

editUserByName(name: any) {
  console.log(name);
  this.loading = true;
  this.alert = "";
  this.adminService.getUserByName(name).subscribe(response => {
    this.loading = false;
    if (response && response.user) {
      const dialogRef = this.dialog.open(UserEditDialogComponent, {
        data: {'user': response},
        width: '800px'
      });
      this.overlayContainer.style.zIndex = '1002';
      const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
        this.overlayContainer.style.zIndex = null;
        if (response && this.showAll === true ) {
          this.updateLocalData(response, null, null, name);
          this.filtered.data.forEach( usr => {
            if (usr['user'] && usr['user'].username === response.user.username){
              usr = response;
            }
          });

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

  editUser(userID: any, index: number): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: {'userID': userID},
      width: '800px'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
        if (response ) {
         this.updateLocalData(response, index, userID, null);
         const backup = this.filtered.data;
        backup[index] = response;
        this.filtered.data = backup;
      }
    });
  }

  // change both dataSource and original source to avoid making an API call after every edit
updateLocalData(response: any, index?: number, id?: number, username?: string, ) {
    this.users.forEach( current => {
      if (index){
        if (current.index = response.index) {
          current = response;
        }
      } else {
        if (current.username = response.username) {
          current = response;
        }
      }
    });
    if(index){
      const backup = this.filtered.data;
      backup[index] = response;
      this.filtered.data = backup;
    }
}


  deleteUser(username: string, index: number): void {
    console.log(index);
    this.adminService.deleteUser(username).subscribe( response => {
      console.log(response);
      if (response) {
        this.updateLocalData(response, index, null, username);
        console.log(this.filtered.data);
          const backup = this.filtered.data;
        backup[index] = response;
        this.filtered.data = backup;
      }
    })
  }

  addUser() {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: {'type': 'add'},
      width: '800px'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response ) {
        const backup = this.filtered.data;
        backup.push(response);
       this.filtered.data = backup;
        this.users.push(response);
      }
    });
  }

  sortData(sort: Sort) {
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.filtered.data = data;
      return;
    }
    this.filtered.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name' : return this.utilsService.compare(a.user.username.toUpperCase(), b.user.username.toUpperCase(), isAsc);
        case 'active' : return this.utilsService.compare(a.active, b.user.active, isAsc);
        case 'email' :return this.utilsService.compare(a.user.email || '', b.user.email || '', isAsc);
        case 'modified' :return this.utilsService.compare(a.modified, b.modified, isAsc);
        case 'created' :return this.utilsService.compare(a.created, b.created, isAsc);
      }
    });
  }

}
