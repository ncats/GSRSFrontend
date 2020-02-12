import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ClinicalTrialService } from '../../../clinical-trials/clinical-trial/clinical-trial.service';
import { SubstanceDetailsBaseTableDisplay } from '../../substance-products/substance-details-base-table-display';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-substance-clinical-trials',
  templateUrl: './substance-clinical-trials.component.html',
  styleUrls: ['./substance-clinical-trials.component.scss']
})

export class SubstanceClinicalTrialsComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  clinicalTrialCount = 0;

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
    }
  }

  getSubstanceClinicalTrials(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.clinicalTrialService.getSubstanceClinicalTrials(this.bdnum, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.clinicalTrialCount = results.length;
      this.countClinicalTrialOut.emit(this.clinicalTrialCount);
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

}
