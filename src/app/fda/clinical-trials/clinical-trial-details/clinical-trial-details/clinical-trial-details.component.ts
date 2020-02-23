import { Component, OnInit } from '@angular/core';
import { ClinicalTrialService } from '../../clinical-trial/clinical-trial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ClinicalTrialDetailsBaseComponent} from '../clinical-trial-details-base.component';
import {environment} from '../../../../../environments/environment';
import { AuthService } from '@gsrs-core/auth/auth.service';

@Component({
  selector: 'app-clinical-trial-details',
  templateUrl: './clinical-trial-details.component.html',
  styleUrls: ['./clinical-trial-details.component.scss']
})

export class ClinicalTrialDetailsComponent extends ClinicalTrialDetailsBaseComponent implements OnInit {

  isAdmin = false;

  constructor(
    clinicalTrialService: ClinicalTrialService,
    activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
    public authService: AuthService
  ) { super(clinicalTrialService, activatedRoute, loadingService, mainNotificationService,
    router, gaService, utilsService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.isAdmin = this.authService.hasAnyRoles('Updater', 'SuperUpdater');

    this.flagIconSrcPath = `${environment.baseHref || '/'}assets/icons/fda/united-states.svg`;

  }

}
