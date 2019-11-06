import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {NucleicAcid, Protein} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-nucleic-acid-details-form',
  templateUrl: './nucleic-acid-details-form.component.html',
  styleUrls: ['./nucleic-acid-details-form.component.scss']
})
// tslint:disable-next-line:max-line-length
export class NucleicAcidDetailsFormComponent extends SubstanceCardBaseFilteredList<NucleicAcid> implements OnInit, AfterViewInit, OnDestroy {

  nucleicAcid: NucleicAcid;
private subscriptions: Array<Subscription> = [];
  nucleicAcidTypeList: Array<VocabularyTerm> = [];
  nucleicAcidSubTypeList: Array<VocabularyTerm> = [];
  sequenceOriginList: Array<VocabularyTerm> = [];
  sequenceTypeList: Array<VocabularyTerm> = [];
  dropdownSettings: IDropdownSettings = {};
  constructor(
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
) {
    super(gaService);
    this.analyticsEventCategory = 'substance form Nucleic Acid Details';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Nucleic Acid Classification');
    const nucleicAcidSubscription = this.substanceFormService.substanceNucleicAcid.subscribe(nucleicAcid => {
      this.nucleicAcid = nucleicAcid;
      setTimeout(() => {this.getVocabularies(); });
    });
    this.subscriptions.push(nucleicAcidSubscription);
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

  update( field: string, event: any): void {
   // this.nucleicAcid[field] = event;
    if (field === 'nucleicAcidSubType') {
      this.nucleicAcid.nucleicAcidSubType = event;
    } else if (field === 'sequenceOrigin') {
      this.nucleicAcid.sequenceOrigin = event;
    } else if (field === 'sequenceType') {
      this.nucleicAcid.sequenceType = event;
    }
  }

  updateTest(event: any) {
    this.nucleicAcid.nucleicAcidSubType = event;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('NUCLEIC_ACID_TYPE', 'NUCLEIC_ACID_SUBTYPE', 'SEQUENCE_ORIGIN', 'SEQUENCE_TYPE').subscribe(response => {
      this.nucleicAcidTypeList = response['NUCLEIC_ACID_TYPE'].list;
      this.nucleicAcidSubTypeList = response['NUCLEIC_ACID_SUBTYPE'].list;
      this.sequenceOriginList = response['SEQUENCE_ORIGIN'].list;
      this.sequenceTypeList = response['SEQUENCE_TYPE'].list;
    });
}

}
