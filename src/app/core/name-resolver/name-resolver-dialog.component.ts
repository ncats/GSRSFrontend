import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { MatButtonModule } from '@angular/material/button';
import { NameResolverComponent } from './name-resolver.component';

@Component({
    selector: 'app-name-resolver-dialog',
    templateUrl: './name-resolver-dialog.component.html',
    styleUrls: ['./name-resolver-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, NameResolverComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
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
