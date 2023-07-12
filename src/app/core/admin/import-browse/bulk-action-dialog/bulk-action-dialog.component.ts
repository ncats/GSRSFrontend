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
  displayedColumns = ['ID', 'name', 'status'];
  loading = false;
  useScrubber = false;
  scrubberModel: any;
  deleteStaged = true;
  altStatusCount = 0;
  completedRecordCount = 0;
  constructor(
   
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    public loadingService: LoadingService,
    private adminService: AdminService,


    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.records = data.records;
    this.scrubberModel = data.scrubberModel;
    if(this.scrubberModel) {
      this.useScrubber = true;
    }
    if (this.records) {
      this.filtered = [];
      this.altStatusCount = 0;
    Object.keys(this.records).forEach(record => {
      if(this.records[record].checked) {
        const temp = {"ID": record, "checked": true, "record": this.records[record].substance};
        this.filtered.push(temp);
        if (this.records[record].substance && this.records[record].substance._metadata && this.records[record].substance._metadata.importStatus
            && this.records[record].substance._metadata.importStatus !== 'staged') {
              this.altStatusCount++;
            }
      }
      });
      this.total = this.filtered.length;
      }
    }
 
  

  ngOnInit(): void {
  }

  deleteStagedRecords(): void {
    let toSend = [];
    this.filtered.forEach(item => {
      if (item.checked) {
        toSend.push(item.ID);
      }
    });
    this.adminService.deleteStagedRecord(toSend).subscribe(response => {
      this.successful = true;
        this.loading = false;
      console.log(response);
    }, error => {
      console.log(error);
      this.successful = true;
        this.loading = false;
    })
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
  let scrubber = null;
  if (this.useScrubber) {
    scrubber = this.scrubberModel;
  }
 
    this.loading = true;
    this.adminService.stagedRecordMultiAction(toSend, action, scrubber).subscribe(result => {
      if (result.jobStatus === 'completed') {
        this.successful = true;
      this.loading = false;
      } else {
        setTimeout(() => {
          this.processingstatus(result.id);
        }, 200);
      }
      

    }, error => {
      alert("Error - see console for details");
      this.loading = false;
      
    });
  }

  close(param?: string) {
    
    this.filtered.forEach(record => {
      this.records[record.ID].checked = record.checked;
    })
    if (this.successful) {
      window.location.reload();
      setTimeout(() => {
        this.dialogRef.close();
      }, 100);
    }
    if (param && param == 'save') {
      this.dialogRef.close(this.records);

    } else {
      this.dialogRef.close();

    }
  }

  processingstatus(id: string): void {
    this.adminService.processingstatus(id).subscribe(response => {
      if (response.jobStatus === 'completed') {
        if(this.deleteStaged) {
          this.deleteStagedRecords();
        } else {
          this.successful = true;
          this.loading = false;
        }
        
      } else {
        if (response && response.completedRecordCount) {
            this.completedRecordCount = response.completedRecordCount;
        }
        setTimeout(() => {
          this.processingstatus(id);
        }, 200);
      }
     

    });
  }

}
