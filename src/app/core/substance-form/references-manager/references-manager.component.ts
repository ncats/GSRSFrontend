import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { ReferencesContainer } from './references-container.model';
import { Observable } from 'rxjs';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl } from '@angular/forms';
import { Reference } from './reference';

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
    this.cvService.getDomainVocabulary('DOCUMENT_TYPE').subscribe(response => {
      this.documentTypes = response['DOCUMENT_TYPE'].list;
      console.log(this.documentTypes);
    });
  }

  loadEditableReferences(): void {
    this.references = [];
    if (this.domainReferenceIds == null) {
      this.references = this.substanceReferences.map(reference => {
        return new Reference(reference);
      });
    } else if (this.domainReferenceIds.length > 0) {
      this.domainReferenceIds.forEach(referenceId => {
        const reference = this.substanceReferences.find((substanceReference, index) => {
          return substanceReference.uuid === referenceId;
        });

        if (reference != null) {
          this.references.push(new Reference(reference));
        }
      });
    }

    setTimeout(() => {
      console.log(this.references[0].getSerializableObject());
    }, 1000);
  }

}
