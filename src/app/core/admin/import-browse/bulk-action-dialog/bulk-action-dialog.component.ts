import { Component, OnInit, Inject } from '@angular/core';
import { ImportDialogComponent } from '@gsrs-core/admin/import-management/import-dialog/import-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingService } from '@gsrs-core/loading';
import { AdminService } from '@gsrs-core/admin/admin.service';

@Component({
  selector: 'app-bulk-action-dialog',
  templateUrl: './bulk-action-dialog.component.html',
  styleUrls: ['./bulk-action-dialog.component.scss']
})
export class BulkActionDialogComponent implements OnInit {
  records: any;
  filtered: Array<any> = [];
  total: number;
  successful = false;
  displayedColumns = ['ID', 'name'];
  loading = false;
  constructor(
   
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    public loadingService: LoadingService,
    private adminService: AdminService,


    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.records = data.records;
    if (this.records) {
    Object.keys(this.records).forEach(record => {
      if(this.records[record].checked) {
        const temp = {"ID": record, "checked": true, "record": this.records[record].substance};
        this.filtered.push(temp);
      }
      });
      this.total = this.filtered.length;
      }
    }
 
  

  ngOnInit(): void {
  }

  checked(event: any, list: any) {
    list.checked = !list.checked;
    if(event.checked) {
      this.total++;
    } else {
      this.total--;
    }
  }

  doAction(action: string, mergeID?: string) {
    let toSend = [];
  this.filtered.forEach(item => {
    if (item.checked) {
      toSend.push({'id':item.ID});
    }
  });
  console.log(toSend);
 
    this.loading = true;
    this.adminService.stagedRecordMultiAction(toSend, action).subscribe(result => {
      console.log(result);
      this.successful = true;
      this.loading = false;

    }, error => {
      console.log(error);
      alert("Error - see console for details");
      this.loading = false;
      
    });
  }

  close(param?: string) {
    this.filtered.forEach(record => {
      this.records[record.ID].checked = record.checked;
    })
    console.log(this.records);
    if (param && param == 'save') {
      this.dialogRef.close(this.records);

    } else {
      this.dialogRef.close();

    }
  }

}
