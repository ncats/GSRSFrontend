import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SubstanceAmount} from '@gsrs-core/substance';

@Component({
  selector: 'app-amount-form-dialog',
  templateUrl: './amount-form-dialog.component.html',
  styleUrls: ['./amount-form-dialog.component.scss']
})
export class AmountFormDialogComponent implements OnInit {
  isNew: boolean;
  subsAmount: SubstanceAmount;

  constructor(
    public dialogRef: MatDialogRef<AmountFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isNew = Object.keys(data.subsAmount).length < 2;
  }

  ngOnInit() {
    this.subsAmount = this.data.subsAmount;
    this.data = this.data.subsAmount;
  }

  save(): void {
    this.dialogRef.close(this.data);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
