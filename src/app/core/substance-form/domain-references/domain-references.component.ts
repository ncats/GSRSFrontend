import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { MatDialog } from '@angular/material/dialog';
import { RefernceFormDialogComponent } from '../references-dialogs/refernce-form-dialog.component';
import { ReuseReferencesDialogComponent } from '../references-dialogs/reuse-references-dialog.component';
import { ReuseReferencesDialogData } from '../references-dialogs/reuse-references-dialog-data.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-domain-references',
  templateUrl: './domain-references.component.html',
  styleUrls: ['./domain-references.component.scss']
})
export class DomainReferencesComponent implements OnInit {
  private domainReferenceUuids: Array<string>;
  private substanceReferences: Array<SubstanceReference>;
  references: Array<SubstanceReference> = [];
  documentTypesDictionary: { [dictionaryValue: string]: VocabularyTerm } = {};
  displayedColumns: string[] = ['type', 'citation', 'publicDomain', 'access', 'goToReference', 'delete', 'attachment'];
  tableData: MatTableDataSource<SubstanceReference>;
  isExpanded = false;

  constructor(
    private cvService: ControlledVocabularyService,
    private substanceFormService: SubstanceFormService,
    private dialog: MatDialog,
    private element: ElementRef
  ) { }

  ngOnInit() {
    this.getVocabularies();
    this.substanceFormService.substanceReferences.subscribe(references => {
      this.substanceReferences = references || [];
      this.loadReferences();
    });
  }

  @Input()
  set referencesUuids(referencesUuids: Array<string>) {
    this.domainReferenceUuids = referencesUuids || [];
    this.loadReferences();
  }

  get referencesUuids(): Array<string> {
    return this.domainReferenceUuids;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('DOCUMENT_TYPE').subscribe(response => {
      this.documentTypesDictionary = response['DOCUMENT_TYPE'].dictionary;
    });
  }

  private loadReferences() {
    if (this.domainReferenceUuids && this.substanceReferences) {
      this.references = [];
      this.domainReferenceUuids.forEach((uuid: string) => {
        const substanceReference = this.substanceReferences.find(reference => reference.uuid === uuid);
        if (substanceReference != null) {
          this.references.push(substanceReference);
        }
      });
      this.tableData = new MatTableDataSource<SubstanceReference>(this.references);
    }
  }

  addNewReference(uuid?: string): void {

    let reference: SubstanceReference = {
      tags: [],
      access: []
    };

    if (uuid != null) {
      reference = this.substanceReferences.find(substanceReference => substanceReference.uuid === uuid);
    }

    const dialogRef = this.dialog.open(RefernceFormDialogComponent, {
      data: reference,
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(newReference => {
      if (newReference != null) {
        newReference = this.substanceFormService.addSubstanceReference(newReference);
        this.addDomainReference(newReference.uuid);
      }
    });
  }

  addDomainReference(uuid: string): void {
    if (this.domainReferenceUuids.indexOf(uuid) === -1) {
      this.domainReferenceUuids.push(uuid);
    }

    let substanceReference = this.references.find(reference => reference.uuid === uuid);
    if (substanceReference == null) {
      substanceReference = this.substanceReferences.find(reference => reference.uuid === uuid);
      if (substanceReference != null) {
        this.references.unshift(substanceReference);
        this.tableData.data = this.references;
      }
    }
  }

  reuseExistingReference(): void {

    const data: ReuseReferencesDialogData = {
      domainRefereceUuids: this.domainReferenceUuids,
      substanceReferences: this.substanceReferences
    };

    const dialogRef = this.dialog.open(ReuseReferencesDialogComponent, {
      data: data,
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(domainRefereceUuids => {
      if (domainRefereceUuids != null) {
        this.updateDomainReferences(domainRefereceUuids);
      }
    });
  }

  updateDomainReferences(referenceUuids: Array<string> = []): void {
    this.domainReferenceUuids.length = 0;
    referenceUuids.forEach(uuid => {
        this.domainReferenceUuids.push(uuid);
    });
    const references = [];
    this.domainReferenceUuids.forEach((uuid: string) => {
      const substanceReference = this.substanceReferences.find(reference => reference.uuid === uuid);
      if (substanceReference != null) {
        references.push(substanceReference);
      }
    });
    this.references = references;
    this.tableData.data = this.references;
  }

  removeDomainReference(uuid: string): void {
    const referenceUuidIndex = this.domainReferenceUuids.indexOf(uuid);

    if (referenceUuidIndex > -1) {
      this.domainReferenceUuids.splice(referenceUuidIndex, 1);
    }
    const substanceReferenceIndex = this.references.findIndex(reference => reference.uuid === uuid);

    if (substanceReferenceIndex > -1) {
      this.references.splice(substanceReferenceIndex, 1);
    }
    this.tableData.data = this.references;
  }

  panelOpened(): void {
    this.isExpanded = true;
    const event: Event = new Event('focusin', { bubbles: true, cancelable: true });
    this.element.nativeElement.dispatchEvent(event);
  }

  panelClosed(): void {
    this.isExpanded = false;
    const event: Event = new Event('focusout', { bubbles: true, cancelable: true });
    this.element.nativeElement.dispatchEvent(event);
  }

}
