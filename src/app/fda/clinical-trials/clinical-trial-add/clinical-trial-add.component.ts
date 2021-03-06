import { Component, OnInit } from '@angular/core';
import { ClinicalTrialService } from '../clinical-trial/clinical-trial.service';
import { ClinicalTrial } from '../clinical-trial/clinical-trial.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
import * as _ from 'lodash';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import {AuthService} from '@gsrs-core/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clinical-add',
  templateUrl: './clinical-trial-add.component.html',
  styleUrls: ['./clinical-trial-add.component.scss']
})
export class ClinicalTrialAddComponent implements OnInit {
  public clinicalTrials: Array<ClinicalTrial>;
  isTesting: Boolean = false;
  isLoading = true;
  isError = false;
  canEdit: boolean;
  json: String = '';

  constructor(
    private clinicalTrialService: ClinicalTrialService,
    private sanitizer: DomSanitizer,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
    this.canEdit = response;
      });
  }

 addClinicalTrial() {
    this.loadingService.setLoading(true);

    this.clinicalTrialService.addClinicalTrial(this.json)
      .subscribe(result => {
        this.isError = false;
        const notification: AppNotification = {
          message: 'You added a clinical trial record.',
          type: NotificationType.success,
          milisecondsToShow: 6000
        };
        this.isError = false;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
        // this.searchClinicalTrials();

      }, error => {
        const notification: AppNotification = {
          message: 'There was an error trying to add a clinical trial.',
          type: NotificationType.error,
          milisecondsToShow: 6000
        };
        this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
      }, () => {
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      });
  }
  updateClinicalTrial() {
    this.loadingService.setLoading(true);
    this.clinicalTrialService.updateClinicalTrial(this.json)
      .subscribe(result => {
        this.isError = false;
        const notification: AppNotification = {
          message: 'You updated a clinical trial record.',
          type: NotificationType.success,
          milisecondsToShow: 6000
        };
        this.isError = false;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
        // this.searchClinicalTrials();

      }, error => {
        const notification: AppNotification = {
          message: 'There was an error trying to update a clinical trial.',
          type: NotificationType.error,
          milisecondsToShow: 6000
        };
        this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
      }, () => {
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      });
  }
}
