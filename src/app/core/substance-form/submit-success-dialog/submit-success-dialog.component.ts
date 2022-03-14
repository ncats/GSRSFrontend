import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-success-dialog',
  templateUrl: './submit-success-dialog.component.html',
  styleUrls: ['./submit-success-dialog.component.scss']
})
export class SubmitSuccessDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SubmitSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  dismissDialog(action: 'continue'|'browse'|'view'): void {
    this.dialogRef.close(action);
  }

}
