import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import {Mixture, SubstanceRelated, SubstanceSummary} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { SubstanceFormBase } from '../base-classes/substance-form-base';

@Component({
  selector: 'app-substance-form-mixture-details',
  templateUrl: './substance-form-mixture-details.component.html',
  styleUrls: ['./substance-form-mixture-details.component.scss']
})
// tslint:disable-next-line:max-line-length
export class SubstanceFormMixtureDetailsComponent  extends SubstanceFormBase implements OnInit, AfterViewInit, OnDestroy {

  parent: SubstanceRelated;
  relatedSubstanceUuid: string;
  mixture: Mixture;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super();
    this.analyticsEventCategory = 'substance form Mixture Details';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Mixture Details');
    const substanceSubscription = this.substanceFormService.substance.subscribe(substance => {
      if (substance.mixture == null) {
        substance.mixture = {
          access: []
        };
      }
      this.mixture = substance.mixture;
      this.parent = substance.mixture.parentSubstance;
      this.relatedSubstanceUuid = this.mixture.parentSubstance && this.mixture.parentSubstance.refuuid || '';
      this.substanceFormService.resetState();
    });
    this.subscriptions.push(substanceSubscription);
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  updateAccess(access: Array<string>): void {
    this.mixture.access = access;
  }

  parentSubstanceUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.mixture.parentSubstance = relatedSubstance;
    this.relatedSubstanceUuid = relatedSubstance && relatedSubstance.refuuid || '';
  }

}
