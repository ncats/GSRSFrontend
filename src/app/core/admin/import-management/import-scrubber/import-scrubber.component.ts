import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import-scrubber',
  templateUrl: './import-scrubber.component.html',
  styleUrls: ['./import-scrubber.component.scss']
})
export class ImportScrubberComponent implements OnInit {

  scrubberSchema: any;
  scrubberModel = {};
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
    public dialogRef: MatDialogRef<ImportScrubberComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.scrubberSchema =  data.scrubberSchema;
    this.scrubberModel = data.scrubberModel;
   }

   select(entry: any) {
    this.toMerge = entry.uuid;
   } 

  ngOnInit(): void {
  }


  checkValue(event: any) {
    this.privateMergeModel = event;
  }

  submit() {
    this.dialogRef.close(this.privateMergeModel);
  }

    
  }


