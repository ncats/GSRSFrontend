import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-submit-success-dialog',
  templateUrl: './submit-success-dialog.component.html',
  styleUrls: ['./submit-success-dialog.component.scss']
})
export class SubmitSuccessDialogComponent implements OnInit {
  dialogMessage: string = "Update was performed.";
  fileUrl: string = null;

  constructor(
    public dialogRef: MatDialogRef<SubmitSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    switch (data.type) {
      case 'submit':
        this.dialogMessage = 'Substance was submitted successfully';
        break;
      case 'approve':
        this.dialogMessage = 'Substance was approved successfully';
        break;
    }

    // If data.fileUrl is not null, this is assumed to be GSRS running within the precisionFDA
    // whereby we display a button that reveals the substance file uploaded onto the pFDA environment
    if (data.fileUrl) {
      this.fileUrl = data.fileUrl;
    }
   }

  ngOnInit() {
  }

  dismissDialog(action: 'continue'|'browse'|'view'|'viewInPfda'): void {
    this.dialogRef.close(action);
  }

}
