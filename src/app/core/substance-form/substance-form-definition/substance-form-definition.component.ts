import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SubstanceFormBase } from '../base-classes/substance-form-base';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { MatSelectChange } from '@angular/material/select';
import { SubstanceService } from '../../substance/substance.service';
import { SubstanceSummary, SubstanceRelationship } from '../../substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceFormDefinition } from '../substance-form.model';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-substance-form-definition',
  templateUrl: './substance-form-definition.component.html',
  styleUrls: ['./substance-form-definition.component.scss']
})
export class SubstanceFormDefinitionComponent extends SubstanceFormBase implements OnInit, AfterViewInit, OnDestroy {
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
  accessLabel?:string;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl({value: '', disabled: true});
  private suggestedTags: Array<string>;
  filteredSuggestedTags: Array<string>;
  private usedSuggestedTags: Array<string> = [];
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];
  defAccess: Array<any>;
  @ViewChild('tagsInput', { read: ElementRef, static: false }) tagsInput: ElementRef<HTMLInputElement>;
  imported = false;
  oldlink = false;

  constructor(
    private cvService: ControlledVocabularyService,
    public substanceService: SubstanceService,
    private substanceFormService: SubstanceFormService,
    private overlayContainerService: OverlayContainer,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,

  ) {
    super();
  }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.menuLabelUpdate.emit('Overview');
    this.getVocabularies();
    this.substanceService.getTags().subscribe(tags => {
      this.suggestedTags = tags;
      this.filteredSuggestedTags = tags;
      this.crossCheckTags();
      this.tagsCtrl.enable();
    });
    const tagsSubscription = this.tagsCtrl.valueChanges.subscribe(value => {
      this.filteredSuggestedTags = this.suggestedTags.filter(tag => tag.toLowerCase().indexOf((value || '').toLowerCase()) > -1);
    });
    this.subscriptions.push(tagsSubscription);

    if (this.configService.configData && this.configService.configData.showOldLinks) {
      this.oldlink = true;

    }
  }

  ngAfterViewInit() {
  const subscription =  this.substanceFormService.definition.subscribe(definition => {
    this.defAccess = this.substanceFormService.getDefinitionForDefRef();
      this.definition = definition || {};
      if (definition && definition.substanceClass && (definition.substanceClass === 'polymer' || definition.substanceClass === 'mixture') && !definition.uuid) {
        this.definition.definitionLevel = 'REPRESENTATIVE';
      }
      this.crossCheckTags();
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
        this.cvService.getDomainVocabulary('RELATIONSHIP_TYPE').pipe(take(1)).subscribe(vocabularyResponse => {
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
      const imported = this.substanceFormService.getMethod();
      const source = this.activatedRoute.snapshot.queryParams['source'] || null;
      if (imported && imported === 'import' && (!source || source !== 'draft')) {
        this.imported = true;
      } else {
        this.imported = false;
      }

    });

    this.subscriptions.push(subscription);

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
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
    this.primarySubUuid = substance.uuid;

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
      .findIndex((relationship) => relationship.relatedSubstance.refuuid === this.primarySubUuid);
    this.definition.relationships.splice(indexToRemove, 1);
    this.primarySubstance = null;
    this.substanceFormService.updateDefinition(this.definition);
  }

  updateAccess(access: Array<string>): void {
    this.definition.access = access;
    this.substanceFormService.updateDefinition(this.definition);
  }

  updateDefAccess(access: Array<string>): void {
    this.substanceFormService.setDefinitionFromDefRef(access);
    this.substanceFormService.updateDefinition(this.definition);
  }

  updateDefinition(): void {
    this.substanceFormService.updateDefinition(this.definition);
  }

  private crossCheckTags(): void {
    if (
      this.definition != null
      && this.definition.tags != null
      && this.definition.tags.length > 0
      && this.suggestedTags != null) {
        const tags = this.definition.tags.sort();
        let i = 0;
        this.definition.tags.forEach(tag => {
          for (i = i; i < this.suggestedTags.length; i++) {
            if (tag.toLowerCase() === this.suggestedTags[i].toLowerCase()) {
              this.suggestedTags.splice(i, 1);
              break;
            }
          }
        });
    }
  }

  tagAdded(event: MatChipInputEvent): void {
    if ((event.value || '').trim()) {
      const addedTag = event.value.trim();
      this.addTag(addedTag);
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  private addTag(addedTag: string): void {
    this.definition.tags.push(addedTag);
    this.updateDefinition();
    for (let i = 0; i < this.suggestedTags.length; i++) {
      if (addedTag.toLowerCase() === this.suggestedTags[i].toLowerCase()) {
        this.suggestedTags.splice(i, 1);
        break;
      }
    }
  }

  removeTag(tag: string): void {
    const tagIndex = this.definition.tags.indexOf(tag);

    if (tagIndex > -1) {
      this.definition.tags.splice(tagIndex, 1);
      this.updateDefinition();

      if (this.usedSuggestedTags.length > 0) {
        for (let i = 0; i < this.usedSuggestedTags.length; i++) {
          if (tag.toLowerCase() === this.usedSuggestedTags[i].toLowerCase()) {
            const availableTag = this.usedSuggestedTags.splice(i, 1)[0];
            this.suggestedTags.push(availableTag);
            this.suggestedTags.sort();
            break;
          }
        }
      }
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    this.definition.tags.push(event.option.value);
    this.updateDefinition();
    this.tagsCtrl.setValue(null);
    this.tagsInput.nativeElement.value = '';
    this.usedSuggestedTags.push(event.option.value);
    const tagIndex = this.suggestedTags.indexOf(event.option.value);
    if (tagIndex > -1) {
      this.suggestedTags.splice(tagIndex, 1);
    }
  }

  tagsAutocompleteClosed(): void {
    this.decreaseOverlayZindex();
    let autocompleteInputValue = this.tagsCtrl.value;
    if (autocompleteInputValue != null && autocompleteInputValue !== '') {
      autocompleteInputValue = autocompleteInputValue.trim();
      this.addTag(autocompleteInputValue);
      this.tagsCtrl.setValue(null);
      this.tagsInput.nativeElement.value = '';
    }
  }

  tagsBlurred(): void {
    if (this.filteredSuggestedTags.length === 0) {
      let autocompleteInputValue = this.tagsCtrl.value;
      if (autocompleteInputValue != null && autocompleteInputValue !== '') {
        autocompleteInputValue = autocompleteInputValue.trim();
        this.addTag(autocompleteInputValue);
        this.tagsCtrl.setValue(null);
        this.tagsInput.nativeElement.value = '';
      }
    }
  }

  increaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = '1002';
  }

  decreaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = null;
  }
}
