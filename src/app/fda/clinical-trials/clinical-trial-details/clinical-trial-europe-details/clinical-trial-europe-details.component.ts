import { Component, OnInit } from '@angular/core';
import { ClinicalTrialService } from '../../clinical-trial/clinical-trial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ClinicalTrialDetailsBaseComponent} from '../clinical-trial-details-base.component'

@Component({
  selector: 'app-clinical-trial-europe-details',
  templateUrl: './clinical-trial-europe-details.component.html',
  styleUrls: ['./clinical-trial-europe-details.component.scss']
})

export class ClinicalTrialEuropeDetailsComponent extends ClinicalTrialDetailsBaseComponent implements OnInit {

  constructor(
    clinicalTrialService: ClinicalTrialService,
    activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
  ) { super(clinicalTrialService, activatedRoute, loadingService, mainNotificationService,
    router, gaService, utilsService);
  }
  
  ngOnInit() {
    super.ngOnInit();
  }

}
