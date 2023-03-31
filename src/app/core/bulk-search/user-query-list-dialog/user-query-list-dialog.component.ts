import { Component, OnInit, Inject } from '@angular/core';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '@gsrs-core/auth';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-user-query-list-dialog',
  templateUrl: './user-query-list-dialog.component.html',
  styleUrls: ['./user-query-list-dialog.component.scss']
})
export class UserQueryListDialogComponent implements OnInit {
  lists: Array<any> = [];
  view = 'all';
  active: any;
  filtered: any;
  activeName: string;
  pagesize = 10;
  page = 0;
  userLists: Array<any>;
  displayedColumns: string[] = ['delete', 'name', 'view'];
  displayedColumns2: string[] = ['delete', 'key', 'name', 'code', 'codeSystem'];
  displayedColumns3: string[] = ['identifier', 'roles', 'action'];

  message = '';
  etag?: string;
  listName?: string;
  listName2?: string;
  showAddButtons = false;
  loading = false;
  status: string;
  loadID: string;
  users = [];
  setUser: string;
  identifier: string;
  isAdmin = false;


  constructor(
    private bulkSearchService: BulkSearchService,
    public dialogRef: MatDialogRef<UserQueryListDialogComponent>,
    private adminService: AdminService,
    private router: Router,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.view = data.view || 'all';
    this.activeName = data.activeName || null;
    this.etag = data.etag || null;
    this.userLists = data.lists || null;

  }

  ngOnInit(): void {
    this.authService.checkAuth().subscribe(response => {
      this.identifier = response.identifier;
      response.roles.forEach(role => {
        if (role === 'Admin') {
          this.isAdmin = true;
        }
      });
    });
    this.getUserLists();
    if (this.view === 'single') {
      this.useDraft(this.activeName);
    }
  }

  viewLists(): void {
    this.getUserLists();
    this.showAddButtons = false;
    this.view = "all";
    this.message ="";
  }

  addList(): void {
    let found = false;
    this.lists.forEach(item => {
      if (item === this.listName) {
        found = true;
      }
    });
    if (!found) {
      this.loading = true;
      this.bulkSearchService.saveBulkSearchEtag(null, this.listName, this.etag).subscribe( response => {
        this.loadID = response.id;
        setTimeout(() => {
          this.refresh();
          }, 100);
        this.message = "Status: sending request";
        this.showAddButtons = true;
      }, error => {
        this.message = "Error: There was a problem adding a new list";
      })
    } else {
      this.message = "Cannot add: This list name is already used";
    }
  }

  appendList(): void {
    let found = false;
    this.lists.forEach(item => {
      if (item === this.listName) {
        found = true;
      }
    });
    if (!found) {
      this.loading = true;
      this.bulkSearchService.editEtagBulkSearchLists(this.listName2, this.etag, 'add').subscribe( response => {
        this.loadID = response.id;
        setTimeout(() => {
          this.refresh();
          }, 100);
        this.message = "Status: sending request";
        this.showAddButtons = true;
      }, error => {
        this.message = "Error: There was a problem adding a new list";
      })
    } else {
      this.message = "Cannot add: This list name is already used";
    }
  }

  useUser(name: string) {
    this.bulkSearchService.getUserBulkSearchLists(name).subscribe(response => {
      this.view = "all";
      this.lists = response.lists;
    });
  }

  pageChange(pageEvent?: PageEvent): void {

    if (pageEvent != null) {

        let eventAction;
        let eventValue;

        if (this.pagesize !== pageEvent.pageSize) {
            eventAction = 'select:page-size';
            eventValue = pageEvent.pageSize;
        } else if (this.page !== pageEvent.pageIndex) {
            eventAction = 'icon-button:page-number';
            eventValue = pageEvent.pageIndex + 1;
        }


        this.page = pageEvent.pageIndex;
        this.pagesize = pageEvent.pageSize;
    }

    this.filtered = [];
    const startIndex = this.page * this.pagesize;
    for (let i = startIndex; i < (startIndex + this.pagesize); i++) {
        if (this.active.lists[i] != null) {
            this.filtered.push(this.active.lists[i]);
        } else {
            break;
        }
    }
  }

  browseView() {
    let navigationExtras: NavigationExtras = {queryParams: {}};
 
      const newtest = this.activeName;
      navigationExtras.queryParams = {'facets': 'User List*' + this.identifier + ':' + newtest.replace(/^.*[\\\/]/, '') + '.true'};
  
    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  refresh() {
    this.bulkSearchService.getSaveBulkListStatus(this.loadID).pipe(take(1)).subscribe(response => {

    
    this.status = response.status;
        this.message = "Status: " + this.status;
        if (this.status === 'Completed.') {
          this.loading = false;
        } else {
          setTimeout(() => {
          this.refresh();
          }, 100);
        }
    }, error => {
        setTimeout(() => {
          this.refresh();
          }, 1000);
    })
  }
  
  getUserLists(): void {
    this.bulkSearchService.getBulkSearchLists().subscribe(result => {
      this.bulkSearchService.listEmitter.next(result.lists);
      this.lists = result.lists;
    }, error => {
      this.message = "Error: Fetching lists failed, see error in console";
      console.log(error);
      
    });
  }
  deleteList(list: string) {
    this.message = '';
    if (confirm("Are you sure you want to delete this list?")){
      this.bulkSearchService.deleteBulkSearchList(list).subscribe(result => {
        this.getUserLists();
      }, error => {
        this.message = "Error: Delete list failed. See browser console";
        console.log(error);
      });
    }
  }

  deleteListEntry(entry: any) {
    let copy = JSON.parse(JSON.stringify(this.active));
    copy.lists = copy.lists.filter(item => {
      return entry.key !== item.key;
    });

    let send = '';
    for (let i = 0; i < copy.lists.length; i++) {
      send += copy.lists[i].key;
      if (i < (copy.lists.length - 1)) {
        send += ',';
      }
    }
    this.message = "";
    this.bulkSearchService.editKeysBulkSearchLists(this.activeName, send, 'remove').subscribe(response => {
      this.active = copy;
      this.filtered = JSON.parse(JSON.stringify(copy.lists)).slice(0, 10);
      this.pagesize = 10;
      this.page = 0;
    }, error => {
      this.message = "Error: Failed to delete. See error in console";
      console.log(error);
    });
  }

  demo() {
    this.bulkSearchService.saveBulkSearchEtag('90e9191d-1a81-4a53-b7ee-560bf9e68109', 'testList', 'f6fe09ff7ae9fab1').subscribe(response => {
    });
  }

  getUsers() {
    this.view = 'users';
    this.adminService.getAllUsers().subscribe(response => {
      this.users = response;
    })
  }

  useDraft(draft: any) {
    this.message = '';
    this.activeName = draft;
    this.bulkSearchService.getSingleBulkSearchList(draft).subscribe(result => {
      this.active = result;
      this.filtered = JSON.parse(JSON.stringify(result.lists)).slice(0, 10);
      this.pagesize = 10;
      this.page = 0;

      this.view = 'single';
    }, error => {
      this.message = "Error: Fetching list failed. See error in console";
      this.view = 'single';
      this.active = {
        "top": 1000,
        "skip": 0,
        "lists": [
            
        ]
    }
    });
  }

}
