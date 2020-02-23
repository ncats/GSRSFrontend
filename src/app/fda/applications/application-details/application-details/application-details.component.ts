import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../service/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ApplicationDetailsBaseComponent} from '../application-details-base.component';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss']
})

export class ApplicationDetailsComponent extends ApplicationDetailsBaseComponent implements OnInit {

  constructor(
    applicationService: ApplicationService,
    public activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
    public authService: AuthService,
  ) {
    super(applicationService, activatedRoute, loadingService, mainNotificationService, router, gaService, utilsService);
    // , authService);
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];

    this.isAdmin = this.authService.hasAnyRoles('Updater', 'SuperUpdater');

    super.ngOnInit();
  }

  get updateApplicationUrl(): string {
    return this.applicationService.getUpdateApplicationUrl();
  }

}
