import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfigService, ExternalSiteWarning } from '@gsrs-core/config';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-external-site-warning-dialog',
    templateUrl: './external-site-warning-dialog.component.html',
    styleUrls: ['./external-site-warning-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatCheckboxModule, FormsModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
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
