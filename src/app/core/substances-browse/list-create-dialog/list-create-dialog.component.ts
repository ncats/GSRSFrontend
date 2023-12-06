import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';

@Component({
  selector: 'app-list-create-dialog',
  templateUrl: './list-create-dialog.component.html',
  styleUrls: ['./list-create-dialog.component.scss']
})
export class ListCreateDialogComponent implements OnInit {
  message: string;
  newList = false;
  listName: string;
  record: any;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  private bulkSearchService: BulkSearchService
) {
  this.message = data.message;
  if (data.newList) {
    this.newList = true;
    this.record = data.record;
  }
}

  ngOnInit(): void {
  }

  addList(): void {
    this.bulkSearchService.saveBulkSearch(this.record.uuid, this.listName).subscribe(response => {
        this.newList = false;
        this.message = "List succesfully created from selected record";
        this.bulkSearchService.getBulkSearchLists().subscribe(response2 => {
          this.bulkSearchService.listEmitter.next(response2.lists);
        });
    }, error => {
      console.log(error);
    });
  }

}
