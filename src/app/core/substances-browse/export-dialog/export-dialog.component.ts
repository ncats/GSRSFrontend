import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {
  name: string;
  extension: string;

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    const date = new Date();
    if (this.data.type && this.data.type !== null && this.data.type !== '') {
      this.name = this.data.type + '-' + moment(date).format('DD-MM-YYYY_H-mm-ss');
    } else {
      this.name = 'export-' + moment(date).format('DD-MM-YYYY_H-mm-ss');
    }
      this.extension = this.data.extension;
  }

  save(): void {
    this.dialogRef.close(this.name);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}

