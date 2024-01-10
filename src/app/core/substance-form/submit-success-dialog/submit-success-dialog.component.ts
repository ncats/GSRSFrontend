import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-submit-success-dialog',
  templateUrl: './submit-success-dialog.component.html',
  styleUrls: ['./submit-success-dialog.component.scss']
})
export class SubmitSuccessDialogComponent implements OnInit {
  dialogTitle: string;
  dialogMessage: string = "Update was performed.";
  fileUrl: string = null;
  appId = "";

  public isCoreSubstance = 'true';
  public staging = false;

  constructor(
    public dialogRef: MatDialogRef<SubmitSuccessDialogComponent>,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    switch (data.type) {
      case 'submit':
        this.dialogTitle = 'Submission Success';
        this.dialogMessage = 'Substance was submitted successfully';
        break;
      case 'approve':
        this.dialogTitle = 'Submission Approved';
        this.dialogMessage = 'Substance was approved successfully';
        break;
    }

    // If data.fileUrl is not null, this is assumed to be GSRS running within the precisionFDA
    // whereby we display a button that reveals the substance file uploaded onto the pFDA environment
    if (data.fileUrl) {
      this.fileUrl = data.fileUrl;
      this.dialogTitle = 'Substance Saved';
      this.dialogMessage = 'The substance was saved successfully as a file in your pFDA My Home area.';
    }
   }

  ngOnInit() {
    if (this.data) {
      if (this.data.isCoreSubstance) {
        this.isCoreSubstance = this.data.isCoreSubstance;
      }
      if (this.data.type && this.data.type === 'staging') {
        this.staging = true;
      }
    }
    this.appId = (this.configService.configData && this.configService.configData.appId) || null;
  }


  dismissDialog(action: 'continue' | 'browse' | 'view' | 'home' | 'staging'|'viewInPfda'): void {
    this.dialogRef.close(action);
  }

}
