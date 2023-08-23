import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-merge-action-dialog',
  templateUrl: './merge-action-dialog.component.html',
  styleUrls: ['./merge-action-dialog.component.scss']
})
export class MergeActionDialogComponent implements OnInit {
  mergeSchema: any;
  mergeModel = {};
  privateMergeModel = {};
  entity: string;
  matches: any;
  toMerge: string;
  loading = false;
  completed = false;
  mergeResponse: any;
  errors: Array<string> = [];
  success = true;
  constructor(
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    if(data.recordId) {
      console.log(data.recordId);

      this.entity = data.recordId;
      this.matches = data.matches;

    }
    if(data.mergeRecord) {
      this.toMerge = data.mergeRecord.ID;
    }
   }

   select(entry: any) {
    this.toMerge = entry;
   } 

  ngOnInit(): void {
    this.getMergeSchema();
  }

  getMergeSchema() {
    this.adminService.getMergeActionSchema().subscribe(response => {
      this.mergeSchema = response;
      console.log(response);
    });
  }

  checkValue(event: any) {
    this.privateMergeModel = event;
  }

  submit() {
    this.loading =true;
    this.adminService.stagedRecordSingleAction(this.entity, 'merge', this.privateMergeModel, this.toMerge).subscribe(response => {
      this.refresh(response.id);
    }, error => {
    this.loading = false;
    })
  }

  restart() {
    this.success = true;
    this.loading = false;
    this.completed = false;
    this.mergeResponse = null;
    this.errors = [];
    this.mergeModel = {};
    this.privateMergeModel = {};
  }

    refresh(id: string): void {
      this.adminService.processingstatus(id).subscribe(response => {
        if (response.results) {
          response.results.forEach(result => {
            this.success = result.completeSuccess;

            if(!this.success) {
              let temp = result.message;
              if (result.error) {
                temp += ". " + result.error;
              }
              this.errors.push(temp);
            }
          });
        }
        if (response.jobStatus === 'completed') {
          
          this.loading = false;
          this.completed = true;
        } else {
          setTimeout(() => {
            this.refresh(id);
          }, 200);
        }
       
  
      });
    }
  }


