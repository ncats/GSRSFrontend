import { Component, OnInit } from '@angular/core';

import { ApplicationService } from '../../service/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ApplicationDetailsBaseComponent} from '../application-details-base.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-application-darrts-details',
  templateUrl: './application-darrts-details.component.html',
  styleUrls: ['./application-darrts-details.component.scss']
})

export class ApplicationDarrtsDetailsComponent extends ApplicationDetailsBaseComponent implements OnInit {

  constructor(
    public applicationService: ApplicationService,
    activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
  ) {
    super(applicationService, activatedRoute, loadingService, mainNotificationService, router, gaService, utilsService);
  }

  ngOnInit() {
    this.appType = this.activatedRoute.snapshot.params['appType'];
    this.appNumber = this.activatedRoute.snapshot.params['appNumber'];
    this.loadingService.setLoading(true);

    if ((this.appType != null) && (this.appNumber != null)) {
      this.getApplicationDarrtsDetails();
    } else {
      this.handleSubstanceRetrivalError();
    }
    // super.ngOnInit();
  }

  getApplicationDarrtsDetails(): void {
    this.applicationService.getApplicationDarrtsDetails(this.appType, this.appNumber).subscribe(response => {
      this.application = response;
      this.loadingService.setLoading(false);
    }, error => {
      this.handleSubstanceRetrivalError();
    });

  }

}
