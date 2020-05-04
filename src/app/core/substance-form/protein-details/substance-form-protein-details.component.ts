import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Protein, SubstanceDetail, SubstanceName } from '@gsrs-core/substance';
import { Subscription } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SubstanceFormBase } from '../base-classes/substance-form-base';

@Component({
  selector: 'app-substance-form-protein-details',
  templateUrl: './substance-form-protein-details.component.html',
  styleUrls: ['./substance-form-protein-details.component.scss']
})
// tslint:disable-next-line:max-line-length
export class SubstanceFormProteinDetailsComponent extends SubstanceFormBase implements OnInit, AfterViewInit, OnDestroy {

  protein: Protein;
  private subscriptions: Array<Subscription> = [];
  dropdownSettings: IDropdownSettings = {};
  constructor(
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super();
    this.analyticsEventCategory = 'substance form Protein Details';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Protein Details');
    const substanceSubscription = this.substanceFormService.substance.subscribe(substance => {
      if (substance.protein == null) {
        // ### figure out why only proteinType takes forever to load causing a console error
        substance.protein = { proteinType: '' };
      }
      this.substanceFormService.resetState();
      this.protein = substance.protein;
    });
    this.subscriptions.push(substanceSubscription);
    this.dropdownSettings = {
      singleSelection: false, idField: 'value', textField: 'display', selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All', itemsShowLimit: 3, allowSearchFilter: true
    };
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  updateAccess(access: Array<string>): void {
    this.protein.access = access;
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
    if (!string || string === '') {
      return [];
    } else {
      return string.split('|');
    }

  }
}
