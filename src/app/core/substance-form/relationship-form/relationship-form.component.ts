import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceRelationship } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-relationship-form',
  templateUrl: './relationship-form.component.html',
  styleUrls: ['./relationship-form.component.scss']
})
export class RelationshipFormComponent implements OnInit {
  private privateRelationship: SubstanceRelationship;
  @Output() relationshipDeleted = new EventEmitter<SubstanceRelationship>();

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
  }

  @Input()
  set relationship(relationship: SubstanceRelationship) {
    this.privateRelationship = relationship;
  }

  get relationship(): SubstanceRelationship {
    return this.privateRelationship;
  }
}
