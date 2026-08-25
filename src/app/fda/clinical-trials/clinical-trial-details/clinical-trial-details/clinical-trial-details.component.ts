import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClinicalTrialService } from '../../clinical-trial/clinical-trial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
import { ClinicalTrialDetailsBaseComponent} from '../clinical-trial-details-base.component';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ConfigService } from '@gsrs-core/config';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-clinical-trial-details',
    templateUrl: './clinical-trial-details.component.html',
    styleUrls: ['./clinical-trial-details.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClinicalTrialDetailsComponent extends ClinicalTrialDetailsBaseComponent implements OnInit {

  constructor(
    clinicalTrialService: ClinicalTrialService,
    activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
    public configService: ConfigService,
    authService: AuthService,
    cdr: ChangeDetectorRef
  ) {
 super(clinicalTrialService, activatedRoute, loadingService, mainNotificationService,
    router, gaService, utilsService, authService, cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
