import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ClinicalTrialService } from '../../../clinical-trials/clinical-trial/clinical-trial.service';
import { SubstanceDetailsBaseTableDisplay } from '../../substance-products/substance-details-base-table-display';
import { PageEvent } from '@angular/material/paginator';
import { FacetParam } from '@gsrs-core/facets-manager';
import { Subscription, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-substance-clinical-trials',
  templateUrl: './substance-clinical-trials.component.html',
  styleUrls: ['./substance-clinical-trials.component.scss']
})

export class SubstanceClinicalTrialsComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  private privateFacetParams: FacetParam;
  clinicalTrialCount = 0;
  showSpinner = false;
  private subscriptions: Array<Subscription> = [];
  @Output() countClinicalTrialOut: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = [
    'nctNumber',
    'title',
    'sponsorName',
    'conditions',
    'outcomemeasures'
  ];

  constructor(
    public gaService: GoogleAnalyticsService,
    private clinicalTrialService: ClinicalTrialService
  ) {
    super(gaService, clinicalTrialService);
  }

  ngOnInit() {
    if (this.bdnum) {
      this.getSubstanceClinicalTrials();
      this.clinicalTrialListExportUrl();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getSubstanceClinicalTrials(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    const subscriptionClinical = this.clinicalTrialService.getClinicalTrials({
      searchTerm: null,
      cutoff: null,
      type: "substancekey",
      order: 'asc',
      pageSize: 5,
      facets: this.privateFacetParams,
      skip: 0
    })
      .subscribe(pagingResponse => {
        this.setResultData(pagingResponse.content);
        this.clinicalTrialCount = pagingResponse.total;
        this.countClinicalTrialOut.emit(this.clinicalTrialCount);
        this.showSpinner = false;  // Stop progress spinner
      });
    /*
        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.clinicaltrials, this.analyticsEventCategory);
        }, error => {
          console.log(error);
        });
        this.countUpdate.emit(clinicaltrials.length);
      });
      */
     this.subscriptions.push(subscriptionClinical);
  }

  clinicalTrialListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.clinicalTrialService.getClinicalTrialListExportUrl(this.bdnum);
    }
  }

}
