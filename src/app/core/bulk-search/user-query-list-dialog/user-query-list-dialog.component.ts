import { Component, OnInit, Inject } from '@angular/core';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  displayedColumns: string[] = ['delete', 'name', 'ID', 'view'];
  displayedColumns2: string[] = ['delete', 'key', 'name', 'code', 'codeSystem'];
  message = '';


  constructor(
    private bulkSearchService: BulkSearchService,
    public dialogRef: MatDialogRef<UserQueryListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.view = data.view || 'all';
    this.activeName = data.activeName || null;
  }

  ngOnInit(): void {
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
    }, error => {
      this.message = "Error: Delete list failed. See console";
      console.log(error);
    });

  }

  deleteListEntry(entry: any) {
    console.log(entry);
    let copy = JSON.parse(JSON.stringify(this.active));
    console.log(copy);
    copy.lists = copy.lists.filter(item => {
      return entry.key !== item.key;
    });
    console.log(copy);

    let send = '';
    for (let i = 0; i < copy.lists.length; i++) {
      send += copy.lists[i].key;
      if (i < (copy.lists.length - 1)) {
        send += ',';
      }
    }
    console.log(send);
    console.log(copy);
    
    this.bulkSearchService.editKeysBulkSearchLists(this.activeName, send, 'remove').subscribe(response => {
      this.active = copy;
    }, error => {
      this.message = "Error: Failed to delete. See error in console";
      console.log(error);
    });
  }

  useDraft(draft: any) {
    this.message = '';
    this.activeName = draft;
    this.bulkSearchService.getSingleBulkSearchList(draft).subscribe(result => {
      this.active = result;
      this.view = 'single';
    }, error => {
      this.message = "Error: Fetching list failed, using demo data. See error in console";
      console.log(error);
      this.view = 'single';
      this.active = {
        "top": 1000,
        "skip": 0,
        "lists": [
            {
                "key": "5b611b0d-b798-45ed-ba02-6f0a2f85986b",
                "displayName": "POTASSIUM CHLORIDE",
                "displayCode": "660YQ98I10",
                "displayCodeSystem": ""
            },
            {
                "key": "302cedcc-895f-421c-acf4-1348bbdb31f4",
                "displayName": "MAGNESIUM CHLORIDE",
                "displayCode": "02F3473H9O",
                "displayCodeSystem": ""
            },
            {
                "key": "79dbcc59-e887-40d1-a0e3-074379b755e4",
                "displayName": "SODIUM ACETATE",
                "displayCode": "4550K0SC9B",
                "displayCodeSystem": ""
            },
            {
                "key": "0e65128d-05e2-4b89-bc68-30a1c555fc2d",
                "displayName": "",
                "displayCode": "",
                "displayCodeSystem": ""
            }
        ]
    }
    });
  }

}
