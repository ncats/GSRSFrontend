import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceRelationship, SubstanceSummary, SubstanceRelated, MediatorSubstance } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-relationship-form',
  templateUrl: './relationship-form.component.html',
  styleUrls: ['./relationship-form.component.scss']
})
export class RelationshipFormComponent implements OnInit {
  private privateRelationship: SubstanceRelationship;
  relatedSubstanceUuid: string;
  mediatorSubstanceUuid: string;
  @Output() relationshipDeleted = new EventEmitter<SubstanceRelationship>();
  deleteTimer: any;

  constructor(
    private cvService: ControlledVocabularyService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
  }

  @Input()
  set relationship(relationship: SubstanceRelationship) {
    this.privateRelationship = relationship;
    if (this.privateRelationship.amount == null) {
      this.privateRelationship.amount = {};
    }
    this.relatedSubstanceUuid = this.privateRelationship.relatedSubstance && this.privateRelationship.relatedSubstance.refuuid || '';
    this.mediatorSubstanceUuid = this.privateRelationship.mediatorSubstance && this.privateRelationship.mediatorSubstance.refuuid || '';
  }

  get relationship(): SubstanceRelationship {
    return this.privateRelationship;
  }


  deleteRelationship(): void {
    this.privateRelationship.$$deletedCode = this.utilsService.newUUID();
    if ((!this.privateRelationship.relatedSubstance || !this.privateRelationship.relatedSubstance.refuuid)
      && !this.privateRelationship.type
    ) {
      this.deleteTimer = setTimeout(() => {
        this.relationshipDeleted.emit(this.relationship);
      }, 2000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateRelationship.$$deletedCode;
  }

  updateAccess(access: Array<string>): void {
    this.relationship.access = access;
  }

  relatedSubstanceUpdated(substance: SubstanceSummary): void {
    if ( substance !== null) {
      const relatedSubstance: SubstanceRelated = {
        refPname: substance._name,
        name: substance._name,
        refuuid: substance.uuid,
        substanceClass: 'reference',
        approvalID: substance.approvalID
      };
      this.relationship.relatedSubstance = relatedSubstance;
    } else {
      this.relationship.relatedSubstance = {};
    }
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
