import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { Observable, Subject } from 'rxjs';
import { SubstanceReference } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { MatDialog } from '@angular/material/dialog';
import { RefernceFormDialogComponent } from '../references-dialogs/refernce-form-dialog.component';

@Component({
  selector: 'app-substance-form-references',
  templateUrl: './substance-form-references.component.html',
  styleUrls: ['./substance-form-references.component.scss']
})
export class SubstanceFormReferencesComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  references: Array<SubstanceReference>;

  constructor(
    private substanceFormService: SubstanceFormService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Substance References');
  }

  ngAfterViewInit() {
    this.substanceFormService.substanceReferences.subscribe(references => {
      this.references = references;
    });
  }

  openReferenceFormDialog(reference: SubstanceReference = { access: [] }): void {

    const dialogRef = this.dialog.open(RefernceFormDialogComponent, {
      data: reference,
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(newReference => {
      if (newReference != null) {
        this.substanceFormService.addSubstanceReference(newReference);
      }
    });
  }

  deleteReference(reference: SubstanceReference): void {
    this.substanceFormService.deleteSubstanceReference(reference);
  }

}
