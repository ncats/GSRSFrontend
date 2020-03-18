import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {
  Polymer,
  PolymerClassification,
  Protein,
  SubstanceDetail,
  SubstanceName,
  SubstanceRelated, SubstanceSummary
} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import { IDropdownSettings} from 'ng-multiselect-dropdown';
import { SubstanceFormBase } from '../substance-form-base';

@Component({
  selector: 'app-substance-form-polymer-classification',
  templateUrl: './substance-form-polymer-classification.component.html',
  styleUrls: ['./substance-form-polymer-classification.component.scss']
})
// tslint:disable-next-line:max-line-length
export class SubstanceFormPolymerClassificationComponent extends SubstanceFormBase
  implements OnInit, AfterViewInit, OnDestroy {

  classification: PolymerClassification;
  parent: SubstanceRelated;
  relatedSubstanceUuid: string;
  private subscriptions: Array<Subscription> = [];
  dropdownSettings: IDropdownSettings = {};
  constructor(
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super();
    this.analyticsEventCategory = 'substance form Polymer Classification';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Polymer Classification');
    const proteinSubscription = this.substanceFormService.substancePolymerClassification.subscribe(classification => {
      this.classification = classification;
      this.relatedSubstanceUuid = this.classification.parentSubstance && this.classification.parentSubstance.refuuid || '';
    });
    this.subscriptions.push(proteinSubscription);

    this.dropdownSettings = { singleSelection: false, idField: 'value', textField: 'display', selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All', itemsShowLimit: 3, allowSearchFilter: true};
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  update(tags: Array<string>): void {
    this.classification.polymerSubClass = tags;
  }

  updateType(type: string): void {
    this.classification.sourceType = type;
  }

  updateGeometry(type: string): void {
    this.classification.polymerGeometry = type;
  }

  updateClass(type: string): void {
      this.classification.polymerClass = type;
  }

  parentSubstanceUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.classification.parentSubstance = relatedSubstance;
    this.relatedSubstanceUuid = relatedSubstance && relatedSubstance.refuuid || '';
  }

  updateAccess(access: Array<string>): void {
    this.classification.access = access;
  }
}
