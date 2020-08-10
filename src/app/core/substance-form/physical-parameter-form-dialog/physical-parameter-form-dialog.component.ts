import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PhysicalModificationParameter, SubstanceParameter} from '@gsrs-core/substance';

@Component({
  selector: 'app-physical-parameter-form-dialog',
  templateUrl: './physical-parameter-form-dialog.component.html',
  styleUrls: ['./physical-parameter-form-dialog.component.scss']
})
export class PhysicalParameterFormDialogComponent implements OnInit {
  isNew: boolean;

  constructor(
    public dialogRef: MatDialogRef<PhysicalParameterFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public subsParameter: PhysicalModificationParameter
  ) {
    this.isNew = Object.keys(subsParameter).length < 1;
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
