import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceRelationship, SubstanceSummary, SubstanceRelated, MediatorSubstance } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../utils/utils.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccessManagerComponent } from '@gsrs-core/substance-form/access-manager/access-manager.component';
import { AmountFormComponent } from '@gsrs-core/substance-form/amount-form/amount-form.component';
import { AuditInfoComponent } from '@gsrs-core/substance-form/audit-info/audit-info.component';
import { CvInputComponent } from '@gsrs-core/substance-form/cv-input/cv-input.component';
import { DomainReferencesComponent } from '@gsrs-core/substance-form/references/domain-references/domain-references.component';
import { SubstanceSelectorComponent } from '@gsrs-core/substance-selector/substance-selector.component';

@Component({
    selector: 'app-relationship-form',
    templateUrl: './relationship-form.component.html',
    styleUrls: ['./relationship-form.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatTooltipModule, AccessManagerComponent, AmountFormComponent, AuditInfoComponent, CvInputComponent, DomainReferencesComponent, SubstanceSelectorComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelationshipFormComponent implements OnInit {
  private privateRelationship: SubstanceRelationship;
  relatedSubstanceUuid: string;
  mediatorSubstanceUuid: string;
  @Output() relationshipDeleted = new EventEmitter<SubstanceRelationship>();
  deleteTimer: any;
  viewFull = true;
  name?: string;

  constructor(
    private cvService: ControlledVocabularyService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {

  }

  @Input()
  set show(val: boolean) {
    if (val != null) {
     this.viewFull = val;
    }
  }

  get show(): boolean {
    return this.viewFull || null;
  }
  @Input()
  set relationship(relationship: SubstanceRelationship) {
    this.privateRelationship = relationship;
    if (this.privateRelationship.amount == null) {
      this.privateRelationship.amount = {};
    }
    this.relatedSubstanceUuid = this.privateRelationship.relatedSubstance && this.privateRelationship.relatedSubstance.refuuid || '';
    this.mediatorSubstanceUuid = this.privateRelationship.mediatorSubstance && this.privateRelationship.mediatorSubstance.refuuid || '';
    this.name = this.privateRelationship.relatedSubstance.refPname? this.privateRelationship.relatedSubstance.refPname : this.privateRelationship.relatedSubstance.name;
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
    if ( substance !== null) {
    const relatedSubstance:  MediatorSubstance = {
      refPname: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.relationship.mediatorSubstance = relatedSubstance;
  } else {
    this.relationship.mediatorSubstance = {};
  }
}
}
