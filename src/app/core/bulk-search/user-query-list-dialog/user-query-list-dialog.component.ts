import { Component, OnInit, Inject } from '@angular/core';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-user-query-list-dialog',
  templateUrl: './user-query-list-dialog.component.html',
  styleUrls: ['./user-query-list-dialog.component.scss']
})
export class UserQueryListDialogComponent implements OnInit {
  lists: Array<any> = [];
  view = 'all';
  active: any;
  activeName: string;
  displayedColumns: string[] = ['delete', 'name', 'view'];
  displayedColumns2: string[] = ['delete', 'key', 'name', 'code', 'codeSystem'];
  message = '';
  etag?: string;
  listName?: string;
  showAddButtons = false;
  loading = false;
  status: string;
  loadID: string;


  constructor(
    private bulkSearchService: BulkSearchService,
    public dialogRef: MatDialogRef<UserQueryListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.view = data.view || 'all';
    this.activeName = data.activeName || null;
    this.etag = data.etag || null;

  }

  ngOnInit(): void {
    
    this.getUserLists();
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
      this.lists = result.lists;
    }, error => {
      this.message = "Error: Fetching lists failed, using demo data. See error in console";
      console.log(error);
      let demo = {
        "top": 1000,
        "skip": 0,
        "lists": [
            "testList1",
            "testList2"
        ]
    };
    this.lists = demo.lists;
    });
  }
  deleteList(list: string) {
    this.message = '';
    this.bulkSearchService.deleteBulkSearchList(list).subscribe(result => {
      this.getUserLists();
    }, error => {
      this.message = "Error: Delete list failed. See console";
      console.log(error);
    });

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
    }, error => {
      this.message = "Error: Failed to delete. See error in console";
      console.log(error);
    });
  }

  demo() {
    this.bulkSearchService.saveBulkSearchEtag('90e9191d-1a81-4a53-b7ee-560bf9e68109', 'testList', 'f6fe09ff7ae9fab1').subscribe(response => {
    });
  }

  useDraft(draft: any) {
    this.message = '';
    this.activeName = draft;
    this.bulkSearchService.getSingleBulkSearchList(draft).subscribe(result => {
      this.active = result;
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
