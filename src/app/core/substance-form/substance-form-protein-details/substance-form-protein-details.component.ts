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
      console.log(this.protein);
      setTimeout(() => {this.getVocabularies(); });
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

  pipeToArray(string: string): Array<string> {
    if (string === '') {
      return [];
    } else {
      return string.split('|');
    }

  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('PROTEIN_TYPE', 'PROTEIN_SUBTYPE', 'SEQUENCE_ORIGIN', 'SEQUENCE_TYPE').subscribe(response => {
      console.log(this.protein.proteinType);
      this.proteinTypeList = this.addOtherOption(response['PROTEIN_TYPE'].list, this.protein.proteinType);
      this.proteinSubTypeList = this.addOtherOption(response['PROTEIN_SUBTYPE'].list, this.protein.proteinSubType);
      this.sequenceOriginList = this.addOtherOption(response['SEQUENCE_ORIGIN'].list, this.protein.sequenceOrigin);
      this.sequenceTypeList = this.addOtherOption(response['SEQUENCE_TYPE'].list, this.protein.sequenceType);
    });
  }

  addOtherOption(vocab: Array<VocabularyTerm>, property: string): Array<VocabularyTerm> {
    if (vocab.some(r => property === r.value)) {
    } else {
    }
    return vocab;
  }
}
