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
  isDeleted = false;
  private privateRelationship: SubstanceRelationship;
  @Output() relationshipDeleted = new EventEmitter<SubstanceRelationship>();
  relationshipTypeList: Array<VocabularyTerm> = [];
  qualificationList: Array<VocabularyTerm> = [];
  interactionTypeList: Array<VocabularyTerm> = [];

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

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('RELATIONSHIP_TYPE', 'QUALIFICATION', 'INTERACTION_TYPE').subscribe(response => {
      this.relationshipTypeList = response['RELATIONSHIP_TYPE'].list;
      this.qualificationList = response['QUALIFICATION'].list;
      this.interactionTypeList = response['INTERACTION_TYPE'].list;
    });
  }

  deleteRelationship(): void {
    this.isDeleted = true;
    setTimeout(() => {
      this.relationshipDeleted.emit(this.relationship);
    }, 500);
  }

  updateAccess(access: Array<string>): void {
    this.relationship.access = access;
  }
}
