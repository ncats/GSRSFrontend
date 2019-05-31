import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { ReferencesContainer } from './references-container.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-references-manager',
  templateUrl: './references-manager.component.html',
  styleUrls: ['./references-manager.component.scss']
})
export class ReferencesManagerComponent implements OnInit {
  @Input() referencesIn?: Observable<ReferencesContainer>;
  @Output() referencesOut = new EventEmitter<ReferencesContainer>();
  references: Array<SubstanceReference>;
  substanceReferences: Array<SubstanceReference>;
  domainReferenceIds?: Array<string>;

  constructor() { }

  ngOnInit() {
    this.referencesIn.subscribe(referencesContainer => {
      this.domainReferenceIds = referencesContainer.domainReferences;
      this.substanceReferences = referencesContainer.substanceReferences;
      this.loadEditableReferences();
    });
  }

  loadEditableReferences(): void {
    this.references = [];
    if (this.domainReferenceIds == null) {
      this.references = this.substanceReferences;
    } else if (this.domainReferenceIds.length > 0) {
      this.domainReferenceIds.forEach(referenceId => {
        const reference = this.substanceReferences.find((substanceReference, index) => {
          return substanceReference.uuid === referenceId;
        });

        if (reference != null) {
          this.references.push(reference);
        }
      });
    }
  }

}
