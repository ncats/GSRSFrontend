import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubstanceReference } from '../../../substance/substance.model';
import { ReuseReferencesDialogData } from './reuse-references-dialog-data.model';
import { ControlledVocabularyService } from '../../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../controlled-vocabulary/vocabulary.model';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-reuse-references-dialog',
  templateUrl: './reuse-references-dialog.component.html',
  styleUrls: ['./reuse-references-dialog.component.scss']
})
export class ReuseReferencesDialogComponent implements OnInit {
  domainReferenceUuids: Array<string> = [];
  substanceReferences: Array<SubstanceReference>;
  documentTypes: { [vocabularyValue: string]: VocabularyTerm } = {};
  displayedColumns: string[] = ['apply', 'type', 'citation', 'publicDomain', 'access'];
  filter = false;
  unfiltered: Array<SubstanceReference>;

  constructor(
    public dialogRef: MatDialogRef<ReuseReferencesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ReuseReferencesDialogData,
    private cvService: ControlledVocabularyService
  ) {
    this.domainReferenceUuids = data.domainRefereceUuids.slice();
    this.substanceReferences = data.substanceReferences;
  }

  ngOnInit() {
    this.unfiltered = JSON.parse(JSON.stringify(this.substanceReferences));
    this.getVocabularies();
    this.dialogRef.beforeClosed().subscribe(() => this.dialogRef.close(
      (this.domainReferenceUuids && this.domainReferenceUuids.length > 0) ? this.domainReferenceUuids : null));
      this.filterRefs();
  }

  filterRefs() {
    this.filter = !this.filter;
    if (this.filter) {
      this.substanceReferences = this.substanceReferences.filter( item => {
          return item.docType !== 'SYSTEM' && item.docType !== 'VALIDATION_MESSAGE';
      });
    } else {
      this.substanceReferences = JSON.parse(JSON.stringify(this.unfiltered));
    }
  }
  

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('DOCUMENT_TYPE').subscribe(response => {
      this.documentTypes = response['DOCUMENT_TYPE'].dictionary;
    });
  }

  toggleReference(event: MatCheckboxChange, reference: SubstanceReference): void {

    const domainReferenceIndex = this.domainReferenceUuids.indexOf(reference.uuid);

    if (event.checked && domainReferenceIndex === -1) {
      this.domainReferenceUuids.push(reference.uuid);
    } else if (!event.checked && domainReferenceIndex > -1) {
      this.domainReferenceUuids.splice(domainReferenceIndex, 1);
    }

  }

  save(): void {
    this.dialogRef.close(this.domainReferenceUuids);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
