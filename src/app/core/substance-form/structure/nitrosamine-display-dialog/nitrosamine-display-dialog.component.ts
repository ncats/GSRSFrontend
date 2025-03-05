import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-nitrosamine-display-dialog',
  templateUrl: './nitrosamine-display-dialog.component.html',
  styleUrls: ['./nitrosamine-display-dialog.component.scss']
})
export class NitrosamineDisplayDialogComponent implements OnInit {
structure: any;
    @Inject(MAT_DIALOG_DATA) public data: any

  constructor(
        public dialogRef: MatDialogRef<NitrosamineDisplayDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.structure = (this.data && this.data.structure) ? this.data.structure : null;
    console.log(this.structure);
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }
}
