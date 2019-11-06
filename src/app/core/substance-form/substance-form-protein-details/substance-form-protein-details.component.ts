import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Protein, SubstanceDetail, SubstanceName} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import { IDropdownSettings} from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-substance-form-protein-details',
  templateUrl: './substance-form-protein-details.component.html',
  styleUrls: ['./substance-form-protein-details.component.scss']
})
// tslint:disable-next-line:max-line-length
export class SubstanceFormProteinDetailsComponent extends SubstanceCardBaseFilteredList<Protein> implements OnInit, AfterViewInit, OnDestroy {

  protein: Protein;
  private subscriptions: Array<Subscription> = [];
  proteinTypeList: Array<VocabularyTerm> = [];
  proteinSubTypeList: Array<VocabularyTerm> = [];
  sequenceOriginList: Array<VocabularyTerm> = [];
  sequenceTypeList: Array<VocabularyTerm> = [];
  dropdownSettings: IDropdownSettings = {};
  constructor(
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form Protein Details';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Protein Details');
    const proteinSubscription = this.substanceFormService.substanceProtein.subscribe(protein => {
      this.protein = protein;
      console.log(protein);
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
    this.protein.proteinSubType = tags.join('|');
  }

  updateType(type: string): void {
    this.protein.proteinType = type;
  }

  updateSequenceType(type: string): void {
    this.protein.sequenceType = type;
}

updateOrigin(type: string): void {
    this.protein.sequenceOrigin = type;
}

  pipeToArray(string: string): Array<string> {
    if (string === '') {
      return [];
    } else {
      return string.split('|');
    }

  }
}
