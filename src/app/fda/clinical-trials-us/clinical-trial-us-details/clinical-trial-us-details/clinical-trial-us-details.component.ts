import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ClinicalTrialUSService } from '../../service/clinical-trial-us.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ClinicalTrialUSDetailsBaseComponent } from '../clinical-trial-us-details-base.component';
import { GeneralService } from '../../../service/general.service';
import { Title} from '@angular/platform-browser';

@Component({
  selector: 'app-clinical-trial-us-details',
  templateUrl: './clinical-trial-us-details.component.html',
  styleUrls: ['./clinical-trial-us-details.component.scss']
})
export class ClinicalTrialUSDetailsComponent extends ClinicalTrialUSDetailsBaseComponent implements OnInit, AfterViewInit {

  constructor(
    public clinicalTrialUSService: ClinicalTrialUSService,
    generalService: GeneralService,
    activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
    titleService: Title
  ) {
    super(clinicalTrialUSService, generalService, activatedRoute, loadingService, mainNotificationService,
      router, gaService, utilsService, titleService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
  }

}
