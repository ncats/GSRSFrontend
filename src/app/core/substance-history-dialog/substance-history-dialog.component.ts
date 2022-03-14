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
  styleUrls: ['./substance-history-dialog.component.scss']
})
export class SubstanceHistoryDialogComponent implements OnInit {
  public substance: SubstanceDetail;
  public status: string;
  public latest: string;
  public version: any;
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
    this.latest = this.data.latest;
    this.version = this.data.version;
    this.status = 'start';
  }

  close(): void {
    this.dialogRef.close('success');

  }

  accept() {
    this.status = 'running';
      this.loadingService.setLoading(true);
      this.substanceService.getSubstanceDetails(this.substance.uuid, this.version).subscribe( sub => {
        this.substance.changeReason = 'reverted to version ' + this.version;
        this.substance.version = this.latest;
        this.substanceService.saveSubstance(this.substance).subscribe( response => {
          this.substance = response;
          this.status = 'complete';
          this.loadingService.setLoading(false);
        }, error => {
          this.status = 'failed';
          this.loadingService.setLoading(false);
          if (error && error.error && error.error.validationMessages) {
            this.validationMessages = error.error.validationMessages;
          } else {
            this.serverError = error;
          }

        });
      }, error => {
        this.status = 'failed';
          this.loadingService.setLoading(false);
          console.log(error);
      });
    }

  }

