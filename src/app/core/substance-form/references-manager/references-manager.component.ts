import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { ReferencesContainer } from './references-container.model';
import { Observable } from 'rxjs';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl } from '@angular/forms';
import { Reference } from './reference';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-references-manager',
  templateUrl: './references-manager.component.html',
  styleUrls: ['./references-manager.component.scss']
})
export class ReferencesManagerComponent implements OnInit {
  @Input() referencesIn?: Observable<ReferencesContainer>;
  @Output() referencesOut = new EventEmitter<ReferencesContainer>();
  references: Array<Reference>;
  substanceReferences: Array<SubstanceReference>;
  domainReferenceIds?: Array<string>;
  documentTypes: Array<VocabularyTerm> = [];
  documentTypeControl = new FormControl();

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.referencesIn.subscribe(referencesContainer => {
      this.domainReferenceIds = referencesContainer.domainReferences;
      this.substanceReferences = referencesContainer.substanceReferences;
      this.loadEditableReferences();
    });
    this.getVocabularies();
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('DOCUMENT_TYPE', 'DOCUMENT_COLLECTION').subscribe(response => {
      this.documentTypes = response['DOCUMENT_TYPE'].list;
    });
  }

  loadEditableReferences(): void {
    this.references = [];
    if (this.domainReferenceIds == null) {
      this.references = this.substanceReferences.map(substanceReference => {
        return new Reference(substanceReference);
      });
    } else if (this.domainReferenceIds.length > 0) {
      this.domainReferenceIds.forEach(referenceId => {
        const substanceReference = this.substanceReferences.find((reference, index) => {
          return reference.uuid === referenceId;
        });

        if (substanceReference != null) {
          const reference = new Reference(substanceReference);
          reference.referenceChanges.subscribe(value => {
            this.updateSubstanceReferences(reference);
            this.outputReferences();
          });

          this.references.push(reference);

          setTimeout(() => {
            reference.emitReferenceAccess();
            reference.emitReferenceTags();
          });
        }
      });
    }
  }

  updateSubstanceReferences(reference: Reference): void {
    for (let i = 0; i < this.substanceReferences.length; i++) {
      if (this.substanceReferences[i].uuid === reference.uuid) {
        this.substanceReferences.splice(i, 1, reference.toSerializableObject());
        break;
      }
    }
  }

  outputReferences(): void {
    const referencesContainer: ReferencesContainer = {
      domainReferences: this.domainReferenceIds,
      substanceReferences: this.substanceReferences
    };

    this.referencesOut.emit(referencesContainer);
  }

  openTagsAutoComplete(): void {
    console.log('here');
  }

}
