import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubstanceReference } from '../../../substance/substance.model';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { AuthService } from '@gsrs-core/auth';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-refernce-form-dialog',
  templateUrl: './refernce-form-dialog.component.html',
  styleUrls: ['./refernce-form-dialog.component.scss']
})
export class RefernceFormDialogComponent implements OnInit {
user: string;
showPrev = false;

  constructor(
    public dialogRef: MatDialogRef<RefernceFormDialogComponent>,
    private substanceService: SubstanceService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public reference: SubstanceReference = {}
  ) {}

  ngOnInit() {
    this.dialogRef.beforeClosed().subscribe(() => this.dialogRef.close(
      ((this.reference.docType && this.reference.docType !== '') &&
      (this.reference.citation && this.reference.citation !== '')) ? this.reference : null));
  }

  save(): void {
    this.dialogRef.close(this.reference);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  fillReference(ref: SubstanceReference) {
    delete ref.uuid;
    delete ref.lastEdited;
    delete ref.lastEditedBy;
    delete ref.created;
    delete ref.createdBy;
    delete ref._self;
    if ((ref.docType && ref.docType !== '') && (ref.citation && ref.citation !== '')) {
      this.reference = ref;
    }
    this.showPrev = false;
  }

}
