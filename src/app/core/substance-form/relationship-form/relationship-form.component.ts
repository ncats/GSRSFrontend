import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceRelationship, SubstanceSummary, SubstanceRelated, MediatorSubstance } from '../../substance/substance.model';
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
  relatedSubstanceUuid: string;
  mediatorSubstanceUuid: string;
  @Output() relationshipDeleted = new EventEmitter<SubstanceRelationship>();
  relationshipTypeList: Array<VocabularyTerm> = [];
  qualificationList: Array<VocabularyTerm> = [];
  interactionTypeList: Array<VocabularyTerm> = [];
  relationshipTypeControl = new FormControl('', [Validators.required]);
  qualificationControl = new FormControl('');
  interactionTypeControl = new FormControl('');
  commentsControl = new FormControl('');

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set relationship(relationship: SubstanceRelationship) {
    this.privateRelationship = relationship;
    this.relatedSubstanceUuid = this.privateRelationship.relatedSubstance && this.privateRelationship.relatedSubstance.uuid || '';
    this.mediatorSubstanceUuid = this.privateRelationship.mediatorSubstance && this.privateRelationship.mediatorSubstance.uuid || '';
    this.relationshipTypeControl.setValue(this.relationship.type);
    this.relationshipTypeControl.valueChanges.subscribe(value => {
      this.relationship.type = value;
    });
    this.qualificationControl.setValue(this.relationship.qualification);
    this.qualificationControl.valueChanges.subscribe(value => {
      this.relationship.qualification = value;
    });
    this.interactionTypeControl.setValue(this.relationship.interactionType);
    this.interactionTypeControl.valueChanges.subscribe(value => {
      this.relationship.interactionType = value;
    });
    this.commentsControl.setValue(this.relationship.comments);
    this.commentsControl.valueChanges.subscribe(value => {
      this.relationship.comments = value;
    });
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

  relatedSubstanceUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.relationship.relatedSubstance = relatedSubstance;
  }

  mediatorSubstanceUpdated(substance: SubstanceSummary): void {
    const relatedSubstance:  MediatorSubstance = {
      refPname: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.relationship.mediatorSubstance = relatedSubstance;
  }
}
