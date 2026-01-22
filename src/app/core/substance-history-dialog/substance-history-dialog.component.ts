import { Component, OnInit, Inject } from '@angular/core';
import { LoadingService } from '@gsrs-core/loading';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { JsonDialogComponent } from '@gsrs-core/substance-form/json-dialog/json-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
    selector: 'app-substance-history-dialog',
    templateUrl: './substance-history-dialog.component.html',
    styleUrls: ['./substance-history-dialog.component.scss'],
    standalone: false
})
export class SubstanceHistoryDialogComponent implements OnInit {
  public substance: SubstanceDetail;
  public status: string;
  public latest!: string;
  public version!: string;
  public validationMessages: Array<string>;
  public serverError: string;


  constructor(
    private loadingService: LoadingService,
    private substanceService: SubstanceService,
    public dialogRef: MatDialogRef<SubstanceHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    this.substance = this.data.substance;
    this.latest = String(this.data.latest);
    this.version = String(this.data.version);
    this.status = 'start';
  }

  close(): void {
    this.dialogRef.close('success');

  }

  accept() {
    this.status = 'running';
    this.loadingService.setLoading(true);

    const version = String(this.version);
    const latest = String(this.latest);
    // Fetch the old version to restore
    this.substanceService.getSubstanceDetails(this.substance.uuid, this.version).subscribe({
      next: sub => {
        sub.changeReason = `reverted to version ${version}`;
        sub.version = latest;

        this.substanceService.saveSubstance(sub).subscribe({
          next: response => {
          this.substance = response;
          this.status = 'complete';
          this.loadingService.setLoading(false);
        }, 
          error: error => {
            this.status = 'failed';
            this.loadingService.setLoading(false);
            this.handleError(error);
        }
      });
    }, 
      error: error => {
        this.status = 'failed';
        this.loadingService.setLoading(false);
        this.handleError(error);
      }
    });
  }

  /**
   * Extracts and stores error information for display.
   */
  private handleError(error: any): void {
    if (error?.error?.validationMessages) {
      this.validationMessages = error.error.validationMessages;
    } else if (error?.message) {
      this.serverError = error.message;
    } else if (error?.error?.message) {
      this.serverError = error.error.message;
    } else if (typeof error === 'string') {
      this.serverError = error;
    } else {
      this.serverError = JSON.stringify(error, null, 2);
    }
  }

  }

