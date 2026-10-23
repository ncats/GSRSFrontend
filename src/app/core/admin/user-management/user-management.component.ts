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
import { format } from 'util';
import { concatMap, map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
    standalone: false
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
  displayedColumns: string[] = ['checkbox', 'name', 'email', 'created', 'modified', 'active', 'actions'];
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
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
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
        disableClose: true,
        panelClass: 'user-edit-dialog'
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
      disableClose: true,
      panelClass: 'user-edit-dialog'
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
        disableClose: true,
        panelClass: 'user-edit-dialog'
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
        disableClose: true,
        panelClass: 'user-edit-dialog'
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
      disableClose: true,
      panelClass: 'user-edit-dialog'
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

  regenerateApiKeyConfirm(username: string, index: number, message: string): void {
    if (confirm(message)) { 
      this.regenerateApiKey(username, index);
    }
  }

  regenerateApiKey(username: string, index: number): void {
    this.adminService.regenerateUserApiKey(username).subscribe( response => {
      // copied from approach used above
      const dialogRef = this.dialog.open(UserEditDialogComponent, {
        data: {userID: response.id, submission: true},
        width: '800px',
        autoFocus: false,
        disableClose: true,
        panelClass: 'user-edit-dialog'
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

   expireUserSessionsConfirm(username: string, index: number, params: any, message: string): void {
    if (confirm(message)) { 
      this.expireUserSessions(username, index, params);
    }
  }

  _expireUserSessions(username: string, index: number, params: any): void {
    this.adminService.expireSessions(username, params).subscribe( response => {
      // copied from approach used above
      const dialogRef = this.dialog.open(UserEditDialogComponent, {
        data: {userID: response.id, submission: true},
        width: '800px',
        autoFocus: false,
        disableClose: true,
        panelClass: 'user-edit-dialog'
      });
      this.overlayContainer.style.zIndex = '1002';
      const dialogSubscription = dialogRef.afterClosed().subscribe(response1 => {
        this.adminService.getUserByName(username).subscribe( response2 => {
        if (response1) {
          console.log("here1");
          this.overlayContainer.style.zIndex = null;
            if (response2) {
          console.log("here2")

              console.log(JSON.stringify(response2, null, 2));
              this.updateLocalData(response2, index, null, username);
                const backup = this.filtered.data;
              backup[index] = response2;
              this.filtered.data = backup;
            }
        }
      });
    });
  });
  }

  expireUserSessions(username: string, index: number, params: any): void {



      // First check if current user is expiring their own sessions (in Admin panel)
      // If so logout the user weather or not revokeTokens is used.
      // This may reduce some edge cases.

      const loggedInUsername = this.authService.auth?.user?.username || this.authService.getUser();
      const isCurrentUser = loggedInUsername.trim().toLowerCase() === username.trim().toLowerCase();
      if (isCurrentUser) {
        this.adminService
          .expireSessions(username, params)
          .pipe(take(1))
          .subscribe(
            () => {
              this.authService.checkAuth()
                .pipe(take(1))
                .subscribe(
                  () => {
                    this.authService.logout();
                    this.loadingService.setLoading(false);

                    this.router.navigate(['/login'], {
                      queryParams: { path: '/home' }
                    });
                  },
                  error => {
                    this.authService.logout();
                    this.loadingService.setLoading(false);
                    if (error.status === 403) {
                      this.router.navigateByUrl('/unauthorized');
                    } else if (error.status === 401) {
                      this.router.navigate(['/login'], {
                        queryParams: { path: '/home' }
                      });
                    } else {
                      console.error(
                        'Unable to determine authentication status:',
                        error
                      );
                    }
                  }
                );
            },

            error => {
              this.loadingService.setLoading(false);
              alert('Unable to expire sessions.');
              console.error('Unable to expire sessions:', error);
            }
          );

        return;
      }

      // If we got here, the user is managing another user's session in Admin panel 
      this.adminService.expireSessions(username, params).pipe(
        concatMap(response1 => {
          return this.adminService.getUserByName(username).pipe(
            map(response2 => ({ response1, response2 }))
          );
        }))
      .subscribe(data => {
        const dialogRef = this.dialog.open(UserEditDialogComponent, {
          data: {userID: data.response2.id, submission: true},
          width: '800px',
          autoFocus: false,
          disableClose: true,
          panelClass: 'user-edit-dialog'
        });
        const dialogSubscription = dialogRef.afterClosed().subscribe(dialogResponse => {
          this.adminService.getUserByName(username).subscribe( response2 => {
            this.overlayContainer.style.zIndex = null;
            if (data.response2) {
              this.updateLocalData(data.response2, index, null, username);
              const backup = this.filtered.data;
              backup[index] = data.response2;
              this.filtered.data = backup;
            }
          });
      });
    });
  }

}

  

