import { Component, OnInit,  ViewChild } from '@angular/core';
import { User, Auth, AuthService } from '@gsrs-core/auth';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UserEditDialogComponent } from '@gsrs-core/admin/user-management/user-edit-dialog/user-edit-dialog.component';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { UtilsService } from '@gsrs-core/utils';
import { DataSource } from '@angular/cdk/table';
import { FormControl } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  userID: number;
  alert: string;
  filtered = new MatTableDataSource();
  searchControl = new FormControl();
  loading = false;
  showAll = false;
  showInactive = false;
  private overlayContainer: HTMLElement;
  displayedColumns: string[] = ['checkbox', 'name', 'email', 'created', 'modified', 'active'];
  page = 0;
  pageSize = 10000;
  paged: Array< any >;
  users: Array< any > = [];
  lastSort: Sort;
  checkedList: Array<string> = [];
  showHideActions: boolean = false;
  private searchTimer: any;

constructor(
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private adminService: AdminService,
    private utilsService: UtilsService,
    private authService: AuthService

  ) { }

  ngOnInit() {
    this.filtered.paginator = this.paginator;
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.showAllUsers();
    this.pageChange();
        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.users);
        }, error => {
        });
}

toggleActions() {
  this.showHideActions = !this.showHideActions;
}

selectUnselectAll(): void {
  if(this.checkedList.length === this.paged.length) { // all are selected, need to deselect all
    this.checkedList = [];
  } else { // select all
    this.checkedList = [];
    for(let user of this.paged) {
      this.checkedList.push(user.user.username);
    }
  }
}

isInCheckList(username): boolean {
  let toReturn = false;
  for(let users of this.checkedList) {
    if(users === username) {
      toReturn = true;
    }
  }
  return toReturn;
}

getPagedIndex(username): number {
  let toReturn = 0;
  this.paged.forEach((user, index) => {
    if(user.user.username === username) {
      toReturn = index;
    }
  });
  return toReturn;
}

markSelected(status): void {
  let extraWarning = '';
  if(status === 'inactive') {
    extraWarning = '. If the user is inactive that user won\'t be able to log in until they\'ve been reactivated'
  }
  if (confirm('Please confirm you would like to set the selected accounts to ' + status + extraWarning
  + '. \n NOTE: Selecting up to 50 at a time may take some time and so is not adviseable.')) {
     switch(status) {
       case 'inactive': 
      this.setSelectedToInactive();
       break;
    }
  }
}

setSelectedToInactive(): void {
  for(let user of this.checkedList) {
    let index = this.getPagedIndex(user);
    this.deleteUsers(user, index);
  }
}

checkListToggle(username): void {
  if(this.checkedList.includes(username)) {
    this.checkedList.forEach((user, index) => {
      if(user === username) {
        this.checkedList.splice(index, 1);
      }
    })
  } else {
    this.checkedList.push(username);
  }
}

showAllUsers(): void {
  this.loading = true;
  this.showAll = true;
  this.adminService.getAllUsers().subscribe(response => {
    this.users = response;
    this.filtered.data = response;
    this.showInactiveUsers();
    this.loading = false;


  });

  this.pageChange();
}

showInactiveUsers(): void {
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
  if (this.searchControl.value && this.searchControl.value !== '') {
    this.searchFields(this.searchControl.value);
  }
  this.pageChange();
}

/* editUserByName(name: any): void {
  this.loading = true;
  this.alert = '';
  this.adminService.getUserByID(name).subscribe(response => {
    this.loading = false;
    if (response && response.user) {
      const dialogRef = this.dialog.open(UserEditDialogComponent, {
        data: {'user': response},
        width: '800px',
        autoFocus: false,
      disableClose: true
      });
      this.overlayContainer.style.zIndex = '1002';
      const dialogSubscription = dialogRef.afterClosed().subscribe(resp => {
        this.overlayContainer.style.zIndex = null;
        if (resp && this.showAll === true ) {
          this.updateLocalData(resp, null, null, resp.user.username);
          this.filtered.data.forEach( usr => {
            if (usr['user'] && usr['user'].username === resp.user.username) {
              usr = resp;
            }
          });
        }
      });
    } else {
      this.alert = 'User Not found';
    }
  }, error => {
    this.alert = 'User Not found';
    this.loading = false;
  });
} */

  editUser(userID: any, index: number): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: {userID: userID, submission: false},
      width: '800px',
      autoFocus: false,
      disableClose: true
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
        if (response ) {
         this.updateLocalData(response, index, userID, null);
         const backup = this.filtered.data;
        backup[index] = response;
        this.filtered.data = backup;
        this.pageChange();
      }
    });
  }

  // change both dataSource and original source to avoid making an API call after every edit
updateLocalData(response: any, index?: number, id?: number, username?: string ) {
    let i = this.users.findIndex(x => x.id === response.id);
    let u = this.users[i];
    this.users[i] = response;
    if (index) {
      const backup = this.filtered.data;
      backup[index] = response;
      this.filtered.data = backup;
    }
    this.pageChange();
}


  deleteUser(username: string, index: number): void {
    if (confirm('Are you sure you want to set this user to inactive? If the user is inactive that user won\'t be able to log in until they\'ve been reactivated.')) {
    this.adminService.deleteUser(username).subscribe( response => {
      const dialogRef = this.dialog.open(UserEditDialogComponent, {
        data: {userID: response.id, submission: true},
        width: '800px',
        autoFocus: false,
        disableClose: true
      });
      this.overlayContainer.style.zIndex = '1002';
      const dialogSubscription = dialogRef.afterClosed().subscribe(response1 => {
        this.overlayContainer.style.zIndex = null;
        if (response) {
          this.updateLocalData(response, index, null, username);
          const backup = this.filtered.data;
          backup[index] = response;
          this.filtered.data = backup;
          this.pageChange();
        }
      });
    });
  }
  }

  // identical to deleteUser but no warning since warning is combined in mark selected
  // only used when user selects multiple users to set inactive
  deleteUsers(username: string, index: number): void {
    this.adminService.deleteUser(username).subscribe( response => {
      const dialogRef = this.dialog.open(UserEditDialogComponent, {
        data: {userID: response.id, submission: true},
        width: '800px',
        autoFocus: false,
        disableClose: true
      });
      this.overlayContainer.style.zIndex = '1002';
      const dialogSubscription = dialogRef.afterClosed().subscribe(response1 => {
        this.overlayContainer.style.zIndex = null;
        if (response) {
          this.updateLocalData(response, index, null, username);
            const backup = this.filtered.data;
          backup[index] = response;
          this.filtered.data = backup;
        }
      });
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: {type: 'add', submission: false},
      width: '800px',
      autoFocus: false,
      disableClose: true
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response ) {
        this.users.push(response);
        this.sortData(this.lastSort);
        this.searchControl.setValue('');
      }
    });
  }

  sortData(sort: any): void {
    this.lastSort = sort;
    let data = this.users.slice();
    if (this.showInactive) {
      data = [];
    this.users.forEach(user => {
      if (user.active) {
        data.push(user);
      }
    });
    }
    if (!sort.active || sort.direction === '') {
      this.filtered.data = data;
      this.pageChange();
      return;
    }
    this.filtered.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name' : return this.utilsService.compare(a.user.username ? a.user.username.toUpperCase() : '',
        b.user.username ? b.user.username.toUpperCase() : '', isAsc);
        case 'active' : return this.utilsService.compare(a.active, b.active, !isAsc);
        case 'email' : return this.utilsService.compare(a.user.email || '', b.user.email || '', isAsc);
        case 'modified' : return this.utilsService.compare(a.modified, b.modified, isAsc);
        case 'created' : return this.utilsService.compare(a.created, b.created, isAsc);
      }
    });
    this.pageChange();
  }

  filterList(searchInput: string, listToFilter: Array<any>): void {
    if (this.searchTimer != null) {
        clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
        this.searchFields(searchInput);
        clearTimeout(this.searchTimer);
        this.pageChange();
        this.searchTimer = null;
    }, 700);
  }

  searchFields(searchInput: string) {
    const backup = [];
    this.users.forEach(user => {
      if (this.showInactive) {
        if (user.active) {
          backup.push(user);
        }
      } else {
        backup.push(user);
      }
    });

    this.filtered.data = [];
    backup.forEach(item => {
      if (item.user) {
      const itemString = item.user.username ? item.user.username.toUpperCase() : null;
      const emailString = item.user.email ? item.user.email.toUpperCase() : null;
        if ((itemString !== null && itemString.indexOf(searchInput.toUpperCase()) > -1) ||
        (emailString !== null && emailString.indexOf(searchInput.toUpperCase()) > -1)) {
            this.filtered.data.push(item);
        }
      }
    });
  }

  pageChange(pageEvent?: PageEvent): void {
    if (pageEvent != null) {
        this.page = pageEvent.pageIndex;
        this.pageSize = pageEvent.pageSize;
    }
    this.paged = [];
    const startIndex = this.page * this.pageSize;
    for (let i = startIndex; i < (startIndex + this.pageSize); i++) {
        if (this.filtered.data[i] != null) {
            this.paged.push(this.filtered.data[i]);
        } else {
            break;
        }
    }
}

}
