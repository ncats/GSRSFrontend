import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { SubstanceService } from '../../substance/substance.service';
import { SubstanceSummary, SubstanceRelationship } from '../../substance/substance.model';
import { Observable, Subscriber, Subject } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceFormDefinition } from '../substance-form.model';

@Component({
  selector: 'app-substance-form-definition',
  templateUrl: './substance-form-definition.component.html',
  styleUrls: ['./substance-form-definition.component.scss']
})
export class SubstanceFormDefinitionComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  definitionTypes: Array<VocabularyTerm>;
  definitionLevels: Array<VocabularyTerm>;
  definitionTypeControl = new FormControl();
  definitionLevelControl = new FormControl();
  deprecatedControl = new FormControl();
  private primarySubstanceErrorSubject = new Subject<string>();
  primarySubstanceErrorEmitter = this.primarySubstanceErrorSubject.asObservable();
  primarySubstance?: SubstanceSummary;
  showPrimarySubstanceOptions = false;
  private accessSubject = new Subject<Array<string>>();
  accessEmitter = this.accessSubject.asObservable();
  private definition: SubstanceFormDefinition;
  private uuidSubject = new Subject<string>();
  uuidEmitter = this.uuidSubject.asObservable();

  constructor(
    private cvService: ControlledVocabularyService,
    public substanceService: SubstanceService,
    private substanceFormService: SubstanceFormService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Definition');
    this.getVocabularies();
  }

  ngAfterViewInit() {
    this.substanceFormService.definition.subscribe(definition => {
      this.definition = definition;

      setTimeout(() => {
        this.accessSubject.next(this.definition.access);
        this.uuidSubject.next(definition.uuid);
      });

      const definitionType = this.definition && this.definition.definitionType || 'primary';
      this.definitionTypeControl.setValue(definitionType);
      const definitionLevel = this.definition && this.definition.definitionLevel || 'complete';
      this.definitionLevelControl.setValue(definitionLevel);

      this.deprecatedControl.setValue(this.definition.deprecated || false);

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
              });
            }
          }
        });
      }
    });
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('DEFINITION_TYPE', 'DEFINITION_LEVEL').subscribe(response => {
      this.definitionTypes = response['DEFINITION_TYPE'].list;
      this.definitionLevels = response['DEFINITION_LEVEL'].list;
    });
  }

  updateDefinitionType(event: MatSelectChange): void {
    this.definition.definitionType = event.value;
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

  updateDefinitionLevel(event: MatSelectChange): void {
    this.definition.definitionLevel = event.value;
    this.substanceFormService.updateDefinition(this.definition);
  }

  processSubstanceSearch(searchValue: string): void {
    const q = searchValue.replace('\"', '');

    const searchStr = `root_names_name:\"^${q}$\" OR ` +
      `root_approvalID:\"^${q}$\" OR ` +
      `root_codes_BDNUM:\"^${q}$\"`;

    this.substanceService.getSubstanceSummaries(searchStr, true).subscribe(response => {
      if (response.content && response.content.length) {
        this.primarySubstance = response.content[0];
        if (this.definition.relationships == null || Object.prototype.toString.call(this.definition.relationships) !== '[object Array]') {
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
        this.primarySubstanceErrorSubject.next('');
      } else {
        setTimeout(() => {
          this.primarySubstanceErrorSubject.next('No substances found');
        });
      }
    });
  }

  editPrimarySubstance(): void {
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

  updateDeprecate(event: MatCheckboxChange): void {
    this.definition.deprecated = event.checked;
    this.substanceFormService.updateDefinition(this.definition);
  }
}
