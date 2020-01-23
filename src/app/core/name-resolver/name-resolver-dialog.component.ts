import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';

@Component({
  selector: 'app-name-resolver-dialog',
  templateUrl: './name-resolver-dialog.component.html',
  styleUrls: ['./name-resolver-dialog.component.scss']
})
export class NameResolverDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NameResolverDialogComponent>,
    public gaService: GoogleAnalyticsService,
  ) { }

  ngOnInit() {
  }

  nameResolved(molfile: string): void {
    this.dialogRef.close(molfile);
  }

  dismissDialog(): void {
    this.gaService.sendEvent('nameResolverDialog', 'button:close', 'cancel resolver');
    this.dialogRef.close();
  }

}
