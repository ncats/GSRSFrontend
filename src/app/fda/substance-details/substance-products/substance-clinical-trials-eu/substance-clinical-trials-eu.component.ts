import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ClinicalTrialService } from '../../../clinical-trials/clinical-trial/clinical-trial.service';
import { SubstanceDetailsBaseTableDisplay } from '../../substance-products/substance-details-base-table-display';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-substance-clinical-trials-eu',
  templateUrl: './substance-clinical-trials-eu.component.html',
  styleUrls: ['./substance-clinical-trials-eu.component.scss']
})

export class SubstanceClinicalTrialsEuropeComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  clinicalTrialEuCount = 0;
  showSpinner = false;
  
  @Output() countClinicalTrialEuOut: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = [
    'nctNumber',
    'title',
    'sponsorName',
    'productName'
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

  getSubstanceClinicalTrials(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.showSpinner = true;  // Start progress spinner
    this.clinicalTrialService.getSubstanceClinicalTrialsEurope(this.bdnum, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.clinicalTrialEuCount = this.totalRecords;
      this.countClinicalTrialEuOut.emit(this.clinicalTrialEuCount);
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
  }

  clinicalTrialListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.clinicalTrialService.getClinicalTrialEuropeListExportUrl(this.bdnum);
    }
  }

}

