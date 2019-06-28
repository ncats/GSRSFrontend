import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { DomainReferences } from './domain-references';
import { SubstanceFormService } from '../substance-form.service';
import { Observable } from 'rxjs';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { MatDialog } from '@angular/material/dialog';
import { RefernceFormDialogComponent } from '../references-dialogs/refernce-form-dialog.component';
import { ReuseReferencesDialogComponent } from '../references-dialogs/reuse-references-dialog.component';
import { ReuseReferencesDialogData } from '../references-dialogs/reuse-references-dialog-data.model';
import {  MatTableDataSource  } from '@angular/material/table';

@Component({
  selector: 'app-domain-references',
  templateUrl: './domain-references.component.html',
  styleUrls: ['./domain-references.component.scss']
})
export class DomainReferencesComponent implements OnInit {
  domainReferences: DomainReferences;
  documentTypesDictionary: { [dictionaryValue: string]: VocabularyTerm } = {};
  displayedColumns: string[] = ['type', 'citation', 'publicDomain', 'access', 'goToReference', 'delete'];
  tableData: MatTableDataSource<SubstanceReference>;
  isExpanded = false;
  @Output() scrolledToReferences = new EventEmitter<void>();

  constructor(
    private cvService: ControlledVocabularyService,
    private substanceFormService: SubstanceFormService,
    private dialog: MatDialog,
    private element: ElementRef
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set uuid(uuid: string) {
    if (uuid != null) {
      this.domainReferences = this.substanceFormService.getDomainReferences(uuid);
      this.tableData = new MatTableDataSource<SubstanceReference>(this.domainReferences.references);
      this.domainReferences.domainReferencesUpdated.subscribe(() => {
        this.tableData.data = this.domainReferences.references;
      });
    }
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('DOCUMENT_TYPE').subscribe(response => {
      this.documentTypesDictionary = response['DOCUMENT_TYPE'].dictionary;
    });
  }

  addNewReference(uuid?: string): void {

    let reference: SubstanceReference = {
      access: []
    };

    if (uuid != null) {
      reference = this.domainReferences.getSubstanceReference(uuid);
    }

    const dialogRef = this.dialog.open(RefernceFormDialogComponent, {
      data: reference,
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(newReference => {
      if (newReference != null) {
        newReference  = this.domainReferences.createSubstanceReference(newReference);
        this.domainReferences.addDomainReference(newReference.uuid);
      }
    });
  }

  reuseExistingReference(): void {

    const data: ReuseReferencesDialogData = {
      domainRefereceUuids: this.domainReferences.domainReferenceUuids,
      substanceReferences: this.domainReferences.substanceReferences
    };

    const dialogRef = this.dialog.open(ReuseReferencesDialogComponent, {
      data: data,
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(domainRefereceUuids => {
      if (domainRefereceUuids != null) {
        this.domainReferences.updateDomainReferences(domainRefereceUuids);
      }
    });
  }

  removeReference(referenceUuid: string): void {
    this.domainReferences.removeDomainReference(referenceUuid);
  }

  panelOpened(): void {
    this.isExpanded = true;
    const event: Event = new Event('focusin', { bubbles: true, cancelable: true} );
    this.element.nativeElement.dispatchEvent(event);
  }

  panelClosed(): void {
    this.isExpanded = false;
    const event: Event = new Event('focusout', { bubbles: true, cancelable: true} );
    this.element.nativeElement.dispatchEvent(event);
  }

}
