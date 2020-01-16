import { Component, OnInit } from '@angular/core';;
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ClinicalTrialService } from '../../../clinical-trials/clinical-trial/clinical-trial.service';

@Component({
  selector: 'app-substance-clinical-trials',
  templateUrl: './substance-clinical-trials.component.html',
  styleUrls: ['./substance-clinical-trials.component.scss']
})

export class SubstanceClinicalTrialsComponent extends SubstanceCardBaseFilteredList<any> implements OnInit {
  public clinicaltrials: Array<any> = [];
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
    super(gaService);
  }

  ngOnInit() {
    console.log("Inside Substance Clinical Trials: ");
   
    if (this.substance) {
      console.log("SUBSTANCE");
    }
    //if (this.substance && this.substance.uuid) {
      this.getSubstanceClinicalTrials();
   // }
  }

  getSubstanceClinicalTrials(): void {
    this.clinicalTrialService.getSubstanceClinicalTrials('AAAAAAA').subscribe(clinicaltrials => {
      console.log("Clinical LENGTH: " + clinicaltrials.length);
      this.clinicaltrials = clinicaltrials;
      this.filtered = clinicaltrials;
      this.pageChange();

      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.clinicaltrials, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.countUpdate.emit(clinicaltrials.length);
    });
  }
    
}
