import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PhysicalModificationParameter, SubstanceParameter} from '@gsrs-core/substance';
import {PropertyParameterDialogComponent} from '@gsrs-core/substance-form/property-parameter-dialog/property-parameter-dialog.component';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';

@Component({
  selector: 'app-physical-parameter-form-dialog',
  templateUrl: './physical-parameter-form-dialog.component.html',
  styleUrls: ['./physical-parameter-form-dialog.component.scss']
})
export class PhysicalParameterFormDialogComponent implements OnInit {
  isNew: Boolean;

  constructor(
    public dialogRef: MatDialogRef<PhysicalParameterFormDialogComponent>,
    public substanceFormService: SubstanceFormService,
    @Inject(MAT_DIALOG_DATA) public parameters: Array<PhysicalModificationParameter>
  ) {
    this.isNew = Object.keys(parameters).length < 2;
  }

  ngOnInit() {
  }

  addStructuralModificationParameter(): void {
    this.parameters.unshift({'amount': {}});
  }

  save(): void {
    console.log('saving dialog');
    console.log(this.parameters);
    this.dialogRef.close(this.parameters);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
