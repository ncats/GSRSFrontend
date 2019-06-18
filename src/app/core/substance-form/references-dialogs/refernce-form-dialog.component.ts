import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubstanceReference } from '../../substance/substance.model';

@Component({
  selector: 'app-refernce-form-dialog',
  templateUrl: './refernce-form-dialog.component.html',
  styleUrls: ['./refernce-form-dialog.component.scss']
})
export class RefernceFormDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RefernceFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public reference: SubstanceReference = {}
  ) {}

  ngOnInit() {
  }

}
