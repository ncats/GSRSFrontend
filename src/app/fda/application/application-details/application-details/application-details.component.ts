import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { Title } from '@angular/platform-browser';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ApplicationDetailsBaseComponent } from '../application-details-base.component';
import { ApplicationService } from '../../service/application.service';
import { GeneralService } from '../../../service/general.service';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss']
})

export class ApplicationDetailsComponent extends ApplicationDetailsBaseComponent implements OnInit {

  constructor(
    applicationService: ApplicationService,
    public generalService: GeneralService,
    public activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
    public authService: AuthService,
    titleService: Title
  ) {
    super(applicationService, generalService, activatedRoute, loadingService, mainNotificationService, router, gaService, utilsService, titleService);
  }

  ngOnInit() {
    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
      this.isAdmin = response;
    });

    this.id = this.activatedRoute.snapshot.params['id'];

    super.ngOnInit();

  }

}
