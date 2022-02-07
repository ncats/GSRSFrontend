import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SubstanceReference } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-previous-references-dialog',
  templateUrl: './previous-references-dialog.component.html',
  styleUrls: ['./previous-references-dialog.component.scss']
})
export class PreviousReferencesDialogComponent implements OnInit {

  constructor(    public dialogRef: MatDialogRef<PreviousReferencesDialogComponent>,
  ) { }

  ngOnInit() {
  }
  cancel(): void {
    this.dialogRef.close();
  }

  fillReference(ref: SubstanceReference) {
    this.dialogRef.close(ref);
  }
}
