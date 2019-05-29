import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { SubstanceService } from '../../substance/substance.service';
import { SubstanceSummary, SubstanceRelationship } from '../../substance/substance.model';
import { Observable, Subscriber, Subject } from 'rxjs';

@Component({
  selector: 'app-substance-form-overview',
  templateUrl: './substance-form-overview.component.html',
  styleUrls: ['./substance-form-overview.component.scss']
})
export class SubstanceFormOverviewComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  definitionTypes: Array<VocabularyTerm>;
  definitionLevels: Array<VocabularyTerm>;
  definitionTypeControl = new FormControl();
  definitionLevelControl = new FormControl();
  primarySubstanceErrorEmitter: Observable<string>;
  private primarySubstanceErrorSubscriber: Subscriber<string>;
  primarySubstance?: SubstanceSummary;
  showPrimarySubstanceOptions = false;
  accessEmitter: Observable<Array<string>>;
  private accessSubscriber: Subscriber<Array<string>>;

  constructor(
    private cvService: ControlledVocabularyService,
    public substanceService: SubstanceService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Overview');
    this.primarySubstanceErrorEmitter = new Observable(observer => {
      this.primarySubstanceErrorSubscriber = observer;
    });
    this.accessEmitter = new Observable(observer => {
      this.accessSubscriber = observer;
    });
    this.getVocabularies();
  }

  ngAfterViewInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      setTimeout(() => {
        this.accessSubscriber.next(substance.access);
      });
      const definitionType = this.substance && this.substance.definitionType || 'primary';
      this.definitionTypeControl.setValue(definitionType);
      const definitionLevel = this.substance && this.substance.definitionLevel || 'complete';
      this.definitionLevelControl.setValue(definitionLevel);

      if (this.substance.definitionType === 'ALTERNATIVE') {
        this.cvService.getDomainVocabulary('RELATIONSHIP_TYPE').subscribe(vocabularyResponse => {
          const type = vocabularyResponse['RELATIONSHIP_TYPE']
            && vocabularyResponse['RELATIONSHIP_TYPE'].dictionary['SUB_ALTERNATE->SUBSTANCE']
            && vocabularyResponse['RELATIONSHIP_TYPE'].dictionary['SUB_ALTERNATE->SUBSTANCE'].value
            || null;

          if (type && this.substance.relationships && this.substance.relationships.length) {
            const primarySubstance = this.substance.relationships.find(relationship => relationship.type === type);
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
    this.substance.definitionType = event.value;
    if (this.substance.definitionType === 'PRIMARY' && this.substance.relationships != null && this.substance.relationships.length) {
      const indexToRemove = this.substance.relationships
        .findIndex((relationship) => relationship.relatedSubstance.refuuid === this.primarySubstance.uuid);
      if (indexToRemove > -1) {
        this.substance.relationships.splice(indexToRemove, 1);
      }
      this.primarySubstance = null;
    }
  }

  updateDefinitionLevel(event: MatSelectChange): void {
    this.substance.definitionLevel = event.value;
  }

  processSubstanceSearch(searchValue: string): void {
    const q = searchValue.replace('\"', '');

    const searchStr = `root_names_name:\"^${q}$\" OR ` +
      `root_approvalID:\"^${q}$\" OR ` +
      `root_codes_BDNUM:\"^${q}$\"`;

    this.substanceService.getSubstanceSummaries(searchStr, true).subscribe(response => {
      if (response.content && response.content.length) {
        this.primarySubstance = response.content[0];
        if (this.substance.relationships == null || Object.prototype.toString.call(this.substance.relationships) !== '[object Array]') {
          this.substance.relationships = [];
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
          this.substance.relationships.push(relationship);
        });
        this.primarySubstanceErrorSubscriber.next('');
      } else {
        setTimeout(() => {
          this.primarySubstanceErrorSubscriber.next('No substances found');
        });
      }
    });
  }

  editPrimarySubstance(): void {
    const indexToRemove = this.substance.relationships
      .findIndex((relationship) => relationship.relatedSubstance.refuuid === this.primarySubstance.uuid);
    this.substance.relationships.splice(indexToRemove, 1);
    this.primarySubstance = null;
  }

  updateAccess(access: Array<string>): void {
    this.substance.access = access;
  }
}
