import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';

@Component({
  selector: 'app-name-resolver-dialog',
  templateUrl: './name-resolver-dialog.component.html',
  styleUrls: ['./name-resolver-dialog.component.scss']
})
export class NameResolverDialogComponent implements OnInit {
  name: string;
  constructor(
    public dialogRef: MatDialogRef<NameResolverDialogComponent>,
    public gaService: GoogleAnalyticsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data.name) {
      this.name = this.data.name;
    }
  }

  nameResolved(molfile: string): void {
    this.dialogRef.close(molfile);
  }

  dismissDialog(): void {
    this.gaService.sendEvent('nameResolverDialog', 'button:close', 'cancel resolver');
    this.dialogRef.close();
  }

}
