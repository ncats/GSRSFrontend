import { Component, OnInit } from '@angular/core';
import { ClinicalTrialService } from '../clinical-trial/clinical-trial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../core/utils/utils.service';
import { SafeUrl } from '@angular/platform-browser';
import { ClinicalTrial } from '../../application/model/application.model';

@Component({
  selector: 'app-clinical-trial-details-base',
  template: '',
  styleUrls: ['./clinical-trial-details-base.component.scss']
})

export class ClinicalTrialDetailsBaseComponent implements OnInit {

  nctNumber: string;
  src: string;
  clinicalTrial: any;
  flagIconSrcPath: string;

  constructor(
    private clinicalTrialService: ClinicalTrialService,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit() {
   // this.loadingService.setLoading(true);
    this.nctNumber = this.activatedRoute.snapshot.params['nctNumber'];
    this.src = this.activatedRoute.snapshot.params['src'];

    if (this.nctNumber != null) {
      this.getClinicalTrialDetails();
    } else {
      this.handleSubstanceRetrivalError();
    }
  }

  getClinicalTrialDetails(): void {
    this.clinicalTrialService.getClinicalTrialDetails(this.nctNumber, this.src).subscribe(response => {
      this.clinicalTrial = response;
   //   this.loadingService.setLoading(false);
    }, error => {
      this.handleSubstanceRetrivalError();
    });
  }

  private handleSubstanceRetrivalError() {
   // this.loadingService.setLoading(false);
    const notification: AppNotification = {
      message: 'The web address above is incorrect. You\'re being forwarded to Browse Substances',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/browse-substance']);
    }, 5000);
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size, true);
  }
}

