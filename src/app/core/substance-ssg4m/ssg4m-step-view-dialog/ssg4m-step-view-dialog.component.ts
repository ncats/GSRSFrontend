import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ssg4m-step-view-dialog',
  templateUrl: './ssg4m-step-view-dialog.component.html',
  styleUrls: ['./ssg4m-step-view-dialog.component.scss']
})

export class Ssg4mStepViewDialogComponent implements OnInit {
  stage: any;
  showProcessIndex: number;
  showSiteIndex: number;
  showStageIndex: number;
  tabSelectedIndex: number;

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<Ssg4mStepViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    if (this.data.processIndex >= 0 && this.data.siteIndex >= 0 && this.data.stageIndex >= 0) {
      this.showProcessIndex = this.data.processIndex;
      this.showSiteIndex = this.data.siteIndex;
      this.showStageIndex = this.data.stageIndex;
    }
  }

  close() {
    this.dialogRef.close();
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

  tabSelectedIndexOutChange(tabIndex: number) {
    this.tabSelectedIndex = tabIndex;

    // Close the Dialog and go to Form View
    this.dialogRef.close(tabIndex);
  }

}
