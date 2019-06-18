import { Component, OnInit, Input } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { DomainReferences } from './domain-references';
import { SubstanceFormService } from '../substance-form.service';
import { Observable } from 'rxjs';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { MatDialog } from '@angular/material/dialog';
import { RefernceFormDialogComponent } from '../references-dialogs/refernce-form-dialog.component';

@Component({
  selector: 'app-domain-references',
  templateUrl: './domain-references.component.html',
  styleUrls: ['./domain-references.component.scss']
})
export class DomainReferencesComponent implements OnInit {
  @Input() uuid: Observable<string>;
  domainReferences: DomainReferences;
  documentTypesDictionary: { [dictionaryValue: string]: VocabularyTerm } = {};

  constructor(
    private cvService: ControlledVocabularyService,
    private substanceFormService: SubstanceFormService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.uuid.subscribe(uuid => {
      this.domainReferences = this.substanceFormService.getDomainReferences(uuid);
    });
    this.getVocabularies();
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
    console.log(reference);
    const dialogRef = this.dialog.open(RefernceFormDialogComponent, {
      data: reference,
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  reuseExistingReference(): void {
    alert('Coming soon!');
  }

}
