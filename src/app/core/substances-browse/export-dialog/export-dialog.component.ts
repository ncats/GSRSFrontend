import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
      this.name = 'export-' + moment(date).format('DD-MM-YYYY_H-mm-ss');
      this.extension = this.data.extension;
  }

  save(): void {
    this.dialogRef.close(this.name);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}

