import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubstanceParameter } from '../../substance/substance.model';

@Component({
  selector: 'app-property-parameter-dialog',
  templateUrl: './property-parameter-dialog.component.html',
  styleUrls: ['./property-parameter-dialog.component.scss']
})
export class PropertyParameterDialogComponent implements OnInit {
  isNew: boolean;

  constructor(
    public dialogRef: MatDialogRef<PropertyParameterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public subsParameter: SubstanceParameter
  ) {
    this.isNew = Object.keys(subsParameter).length < 2;
  }

  ngOnInit() {
  }

  save(): void {
    this.dialogRef.close(this.subsParameter);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
