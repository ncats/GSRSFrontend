import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormBase } from '../base-classes/substance-form-base';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { MatSelectChange } from '@angular/material/select';
import { SubstanceService } from '../../substance/substance.service';
import { SubstanceSummary, SubstanceRelationship } from '../../substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceFormDefinition } from '../substance-form.model';
import { MatChipInputEvent } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-substance-form-definition',
  templateUrl: './substance-form-definition.component.html',
  styleUrls: ['./substance-form-definition.component.scss']
})
export class SubstanceFormDefinitionComponent extends SubstanceFormBase implements OnInit, AfterViewInit {
  definitionTypes: Array<VocabularyTerm>;
  definitionLevels: Array<VocabularyTerm>;
  primarySubstance?: SubstanceSummary;
  definition: SubstanceFormDefinition;
  primarySubUuid: string;
  uuid: string;
  json: any;
  feature: string;
  substanceClass: string;
  status: string;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private cvService: ControlledVocabularyService,
    public substanceService: SubstanceService,
    private substanceFormService: SubstanceFormService,

  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Overview');
    this.getVocabularies();
  }

  ngAfterViewInit() {
    this.substanceFormService.definition.subscribe(definition => {
      this.definition = definition || {};
      if (this.definition.substanceClass === 'structure') {
        this.substanceClass = 'chemical';
      } else if (this.definition.substanceClass === 'nucleicAcid') {
        this.substanceClass = 'Nucleic Acid';
      } else if (this.definition.substanceClass === 'structurallyDiverse') {
        this.substanceClass = 'Structurally Diverse';
      } else if (this.definition.substanceClass.toUpperCase() === 'SPECIFIEDSUBSTANCE') {
        this.substanceClass = 'Specified Substance Group 1';
      } else if (this.definition.substanceClass.toUpperCase() === 'SPECIFIEDSUBSTANCEG3') {
        this.substanceClass = 'Specified Substance Group 3';
      } else {
        this.substanceClass = this.definition.substanceClass;
      }
      if (!this.definition.definitionType) {
        this.definition.definitionType = 'PRIMARY';
      }

      if (!this.definition.definitionLevel) {
        this.definition.definitionLevel = 'COMPLETE';
      }
      this.json = this.substanceFormService.getJson();
      if (this.definition.status) {
        this.status = this.definition.status;
      }
      if (this.definition.definitionType === 'ALTERNATIVE') {
        this.cvService.getDomainVocabulary('RELATIONSHIP_TYPE').subscribe(vocabularyResponse => {
          const type = vocabularyResponse['RELATIONSHIP_TYPE']
            && vocabularyResponse['RELATIONSHIP_TYPE'].dictionary['SUB_ALTERNATE->SUBSTANCE']
            && vocabularyResponse['RELATIONSHIP_TYPE'].dictionary['SUB_ALTERNATE->SUBSTANCE'].value
            || null;

          if (type && this.definition.relationships && this.definition.relationships.length) {
            const primarySubstance = this.definition.relationships.find(relationship => relationship.type === type);
            if (primarySubstance != null) {
              this.substanceService.getSubstanceSummary(primarySubstance.relatedSubstance.refuuid).subscribe(response => {
                this.primarySubstance = response;
                this.primarySubUuid = this.primarySubstance.uuid;
              });
            }
          }
        });
      }
      this.uuid = this.substanceFormService.getUuid();

    });

  }


  getRedirect() {
    if (this.uuid) {
      return this.substanceService.oldSiteRedirect('edit', this.substanceFormService.getUuid());
    } else {
      return '#';
    }
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('DEFINITION_TYPE', 'DEFINITION_LEVEL').subscribe(response => {
      this.definitionTypes = response['DEFINITION_TYPE'].list;
      this.definitionLevels = response['DEFINITION_LEVEL'].list;
    });
  }

  updateDefinitionType(event: MatSelectChange): void {
    if (this.definition.definitionType === 'PRIMARY' && this.definition.relationships != null && this.definition.relationships.length) {
      const indexToRemove = this.definition.relationships
        .findIndex((relationship) => relationship.relatedSubstance.refuuid === this.primarySubstance.uuid);
      if (indexToRemove > -1) {
        this.definition.relationships.splice(indexToRemove, 1);
      }
      this.primarySubstance = null;
    }
    this.substanceFormService.updateDefinition(this.definition);
  }

  primartySubstanceUpdated(substance?: SubstanceSummary): void {
    if (substance != null) {
      this.setPrimarySubstance(substance);
    } else {
      this.removePrimarySubstance();
    }
  }

  setPrimarySubstance(substance: SubstanceSummary): void {

    this.primarySubstance = substance;

    if (this.definition.relationships == null
      || Object.prototype.toString.call(this.definition.relationships) !== '[object Array]') {
      this.definition.relationships = [];
    }
    this.cvService.getDomainVocabulary('RELATIONSHIP_TYPE').subscribe(vocabularyResponse => {
      const relationship: SubstanceRelationship = {
        relatedSubstance: {
          refuuid: this.primarySubstance.uuid,
          refPname: this.primarySubstance._name,
          approvalID: this.primarySubstance.approvalID,
          substanceClass: 'reference'
        },
        access: [],
        type: vocabularyResponse['RELATIONSHIP_TYPE']
          && vocabularyResponse['RELATIONSHIP_TYPE'].dictionary['SUB_ALTERNATE->SUBSTANCE']
          && vocabularyResponse['RELATIONSHIP_TYPE'].dictionary['SUB_ALTERNATE->SUBSTANCE'].value
          || ''
      };
      this.definition.relationships.push(relationship);
      this.substanceFormService.updateDefinition(this.definition);
    });
  }

  removePrimarySubstance(): void {
    const indexToRemove = this.definition.relationships
      .findIndex((relationship) => relationship.relatedSubstance.refuuid === this.primarySubstance.uuid);
    this.definition.relationships.splice(indexToRemove, 1);
    this.primarySubstance = null;
    this.substanceFormService.updateDefinition(this.definition);
  }

  updateAccess(access: Array<string>): void {
    this.definition.access = access;
    this.substanceFormService.updateDefinition(this.definition);
  }

  updateDefinition(): void {
    this.substanceFormService.updateDefinition(this.definition);
  }

  addTag(event: MatChipInputEvent): void {
    if ((event.value || '').trim()) {
      this.definition.tags.push(event.value.trim());
      this.updateDefinition();
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  removeTag(tag: string): void {
    const tagIndex = this.definition.tags.indexOf(tag);

    if (tagIndex > -1) {
      this.definition.tags.splice(tagIndex, 1);
      this.updateDefinition();
    }
  }
}
