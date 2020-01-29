import { Component, OnInit } from '@angular/core';
import { ClinicalTrialService } from '../clinical-trial/clinical-trial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-clinical-trial-details',
  templateUrl: './clinical-trial-details.component.html',
  styleUrls: ['./clinical-trial-details.component.scss']
})
export class ClinicalTrialDetailsComponent implements OnInit {
  
  nctNumber: string;
  clinicalTrial: any;

  constructor(
    private clinicalTrialService: ClinicalTrialService,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private gaService: GoogleAnalyticsService
  ) {
  }

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.nctNumber = this.activatedRoute.snapshot.params['nctNumber'];
    if (this.nctNumber != null) {
      this.getClinicalTrialDetails();
    } else {
     // this.handleSubstanceRetrivalError();
    }
  }

  getClinicalTrialDetails(): void {
    this.clinicalTrialService.getClinicalTrialDetails(this.nctNumber).subscribe(results => {
      this.clinicalTrial = results;
      this.loadingService.setLoading(false);
    });
  }

}
