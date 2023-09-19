import { Component, OnInit, Inject } from '@angular/core';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '@gsrs-core/auth';
import { PageEvent } from '@angular/material/paginator';
import { SubstanceService } from '@gsrs-core/substance';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  etagIDs = [];
  uniqueRecords = [];
  disabled = false;
  loaded = false;
  filename: string;
  importedList: any;
  pastedJson: any;
  viewCreated = false;
  downloadJsonHref: SafeUrl;
  refreshing = false;

  constructor(
    private bulkSearchService: BulkSearchService,
    public dialogRef: MatDialogRef<UserQueryListDialogComponent>,
    private adminService: AdminService,
    private substanceService: SubstanceService,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.view = data.view || 'all';
    this.activeName = data.activeName || null;
    this.etag = data.etag || null;
    this.userLists = data.lists || null;

  }

  ngOnInit(): void {
    this.substanceService.getAllByEtag(this.etag).subscribe(result => {
      if(result.content) {
        result.content.forEach(record => {
          this.etagIDs.push(record.uuid);
        })
      }

    });
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
    this.refreshing = false;

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
          
          this.refresh('add');
          }, 100);
        this.message = "Status: sending request";
        this.showAddButtons = true;
      }, error => {
        this.message = "Error: There was a problem adding a new list";
        this.loading = false;

      })
    } else {
      this.message = "Cannot add: This list name is already used";
      this.loading = false;
    }
  }

  checkList(): void {
    this.bulkSearchService.getSingleBulkSearchList(this.listName2).subscribe(result => {
      let tosend = [];
      result.lists.forEach(list => {
        tosend.push(list.key);
      })
      if (this.etagIDs.length > 0) {
        this.compareLists(tosend);
      }
      
    });
  }

  compareLists(list: any) {
    this.uniqueRecords = this.etagIDs.filter(obj => { return list.indexOf(obj) == -1; });
    if (this.uniqueRecords.length == 0) {
      this.message = "NOTICE: All records already exist in selected list";
      this.disabled = true;
    } else {
      this.disabled = false;
      this.message = "Add " + this.uniqueRecords.length + " records to list.";
      if (this.uniqueRecords.length < this.etagIDs.length) {
        this.message += " Ignore " + (this.etagIDs.length - this.uniqueRecords.length) + " duplicates";
      }
    }
  }

  appendList(): void {
    this.refreshing = false;

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
          this.refresh('append');
          }, 100);
        this.message = "Status: sending request";
        this.showAddButtons = true;
      }, error => {
        this.message = "Error: There was a problem adding a new list";
      });
    } else {
      this.message = "Cannot add: This list name is already used";
    }
  
  }

  useUser(name: string) {
    this.refreshing = false;

    this.viewCreated = false;
    this.setUser = null;
    this.loaded = false;
    this.bulkSearchService.getUserBulkSearchLists(name).subscribe(response => {
      this.view = "all";
      this.lists = response.lists;
      this.setUser = name;
    });
  }

  pageChange(pageEvent?: PageEvent): void {
    this.refreshing = false;

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
      navigationExtras.queryParams = {'facets': 'User List*' + this.identifier.replace(/[.]/g, '!.') + ':' + newtest.replace(/^.*[\\\/]/, '') + '.true'};
  
    this.router.navigate(['/browse-substance'], navigationExtras);
    this.dialogRef.close();
  }

  refresh(type: string) {
    this.bulkSearchService.getSaveBulkListStatus(this.loadID).pipe(take(1)).subscribe(response => {

    this.status = response.status;
    this.refreshing = true;
    console.log(response);
        this.message = "Status: " + this.status;
        if (this.status === 'Completed.') {
          this.loading = false;
          this.refreshing = false;

        } else {
          setTimeout(() => {
          this.refresh(type);
          }, 100);
        }
    }, error => {
        setTimeout(() => {
          this.refresh(type);
          console.log(error);
          }, 1000);
    })
  }
  
  getUserLists(): void {
    this.refreshing = false;
    this.bulkSearchService.getBulkSearchLists().subscribe(result => {
      this.bulkSearchService.listEmitter.next(result.lists);
      this.lists = result.lists;
      this.setUser = null;
    }, error => {
      console.log(error);

      this.message = "Error: Fetching lists failed, see error in console";
      
    });
  }
  deleteList(list: string) {
    this.message = '';
    if (confirm("Are you sure you want to delete this list?")){
      this.bulkSearchService.deleteBulkSearchList(list).subscribe(result => {
        this.getUserLists();
      }, error => {
        console.log(error);
        this.message = "Error: Delete list failed. See browser console";
        
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
    this.bulkSearchService.editKeysBulkSearchLists(this.activeName, entry.key, 'remove').subscribe(response => {
      this.active = copy;
      this.filtered = JSON.parse(JSON.stringify(copy.lists)).slice(0, 10);
      this.pagesize = 10;
      this.page = 0;
    }, error => {
      console.log(error);
      this.message = "Error: Failed to delete. See error in console";
    });
  }

  demo() {
    this.bulkSearchService.saveBulkSearchEtag('90e9191d-1a81-4a53-b7ee-560bf9e68109', 'testList', 'f6fe09ff7ae9fab1').subscribe(response => {
    });
  }

  getUsers() {
    this.refreshing = false;
    this.viewCreated = false;
    this.loaded = false;
    this.view = 'users';
    this.adminService.getAllUsers().subscribe(response => {
      this.users = response;
    })
  }

  useDraft(draft: any) {
    this.refreshing = false;
    this.viewCreated = false;
    this.message = '';
    this.activeName = draft;
    this.bulkSearchService.getSingleBulkSearchList(draft, this.setUser).subscribe(result => {
      this.active = result;
      this.filtered = JSON.parse(JSON.stringify(result.lists)).slice(0, 10);
      this.pagesize = 10;
      this.page = 0;
      const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(result.lists)));
      this.downloadJsonHref = uri;

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

  uploadFile(event) {
    this.refreshing = false;
    this.viewCreated = false;
    if (event.target.files.length !== 1) {
      this.message = 'No file selected';
          this.loaded = false;
    } else {
      const file = event.target.files[0];
      this.filename = file.name;
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const response = reader.result.toString().replace('\t','');
        if (this.jsonValid(response)) {
          const read = JSON.parse(response);
            this.pastedJson = response;
            this.loaded = true;
            this.importedList = response;
            this.message = '';
    
        } else {
          this.message = 'Error: Invalid file format';
          this.loaded = false;
        }
      };
      reader.readAsText(event.target.files[0]);

     // this.uploaded = true;
    }
  }

  useFile() {
    this.loading =true;
    this.refreshing = false;
    this.viewCreated = false;
    if (this.loaded && this.pastedJson) {
        const read = JSON.parse(this.pastedJson);
        if (!read[0]['key']) {
          this.message = 'Error: Invalid JSON format';
          this.loaded = false;
          this.loading =true;
        } else {
          this.loaded = true;
          this.importedList = read;
          const mapped = read.map(x=> x.key).join(',');
          this.bulkSearchService.saveBulkSearch( mapped, this.listName, 'add').subscribe(response => {
            this.getUserLists();
            this.loading = false;
            this.message = "List Successfully Created";
            this.viewCreated = true;
          }, error => {
            this.loading = false;
          })
         // this.pastedJson.forEach()
          this.message = '';
        }
    }
  }

  useCreated() {
    this.view = "single";
    this.viewCreated = false;
    this.refreshing = false;
    this.loaded = false;
    this.useDraft(this.listName);
  }


  checkLoaded() {
    this.loaded = true;
    try {
      JSON.parse(this.pastedJson);
      this.message = '';
  } catch (e) {
    this.message = 'Error: Invalid JSON format in pasted string';
    this.loaded = false;
  }
}


  openInput(): void {
    document.getElementById('fileInput').click();
  }

  jsonValid(file: any): boolean {
    try {
      JSON.parse(file);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }

  close(){
    this.dialogRef.close();
  }


}
