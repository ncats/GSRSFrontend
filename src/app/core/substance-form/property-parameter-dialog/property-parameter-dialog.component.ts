import { ChangeDetectionStrategy, Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubstanceParameter } from '../../substance/substance.model';
import { MatButtonModule } from '@angular/material/button';
import { PropertyParameterFormComponent } from '@gsrs-core/substance-form/property-parameter-form/property-parameter-form.component';

@Component({
    selector: 'app-property-parameter-dialog',
    templateUrl: './property-parameter-dialog.component.html',
    styleUrls: ['./property-parameter-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, PropertyParameterFormComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
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
