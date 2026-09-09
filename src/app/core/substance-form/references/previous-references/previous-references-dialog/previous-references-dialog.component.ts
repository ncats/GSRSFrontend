import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SubstanceReference } from '@gsrs-core/substance/substance.model';
import { MatButtonModule } from '@angular/material/button';
import { PreviousReferencesComponent } from '@gsrs-core/substance-form/references/previous-references/previous-references.component';

@Component({
    selector: 'app-previous-references-dialog',
    templateUrl: './previous-references-dialog.component.html',
    styleUrls: ['./previous-references-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, PreviousReferencesComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
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
