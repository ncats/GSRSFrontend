import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService, ExternalSiteWarning } from '@gsrs-core/config';

@Component({
  selector: 'app-external-site-warning-dialog',
  templateUrl: './external-site-warning-dialog.component.html',
  styleUrls: ['./external-site-warning-dialog.component.scss']
})
export class ExternalSiteWarningDialogComponent implements OnInit {
  externalSiteWarning: ExternalSiteWarning;
  dontAskAgain: boolean;

  constructor(
    public dialogRef: MatDialogRef<ExternalSiteWarningDialogComponent>,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.externalSiteWarning = this.configService.configData.externalSiteWarning;
    this.dontAskAgain = localStorage.getItem('externalSiteWarningDontAskAgain') === 'true';
  }

  acceptDialog() {
    localStorage.setItem('externalSiteWarningDontAskAgain', this.dontAskAgain.toString());

    this.dialogRef.close(true);
  }

  cancelDialog() {
    this.dialogRef.close(false);
  }
}
