import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-nitrosamine-display-dialog',
    templateUrl: './nitrosamine-display-dialog.component.html',
    styleUrls: ['./nitrosamine-display-dialog.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NitrosamineDisplayDialogComponent implements OnInit {
structure: any;

  constructor(
        public dialogRef: MatDialogRef<NitrosamineDisplayDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.structure = (this.data && this.data.structure && this.data.structure.smiles) ? this.data.structure.smiles : null;
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }
}
