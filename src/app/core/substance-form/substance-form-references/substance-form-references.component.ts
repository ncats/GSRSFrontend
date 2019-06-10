import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ReferencesContainer } from '../references-manager/references-container.model';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-substance-form-references',
  templateUrl: './substance-form-references.component.html',
  styleUrls: ['./substance-form-references.component.scss']
})
export class SubstanceFormReferencesComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  private referencesContainerSubject = new Subject<ReferencesContainer>();
  referencesContainerEmitter = this.referencesContainerSubject.asObservable();
  private subClass: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Substance References');
  }

  ngAfterViewInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;

      this.subClass = this.substance.substanceClass;

      if (this.subClass === 'chemical') {
        this.subClass = 'structure';
      } else if (this.subClass === 'specifiedSubstanceG1') {
        this.subClass = 'specifiedSubstance';
      }

      const referencesContainer: ReferencesContainer = {
        substanceReferences: this.substance.references,
        substance: this.substance
      };

      setTimeout(() => {
        this.referencesContainerSubject.next(referencesContainer);
      });
    });
  }

  updateReferences(referencesContainer: ReferencesContainer): void {
    this.substance.references = referencesContainer.substanceReferences;

    if (referencesContainer.substance) {
      this.substanceUpdated.next(referencesContainer.substance);
    }
  }

}
