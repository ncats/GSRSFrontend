import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../service/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ControlledVocabularyService } from '../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../core/controlled-vocabulary/vocabulary.model';
import { ApplicationSrs } from '../model/application.model';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {

  application: ApplicationSrs;
  centerList: Array<VocabularyTerm> = [];
  appTypeList: Array<VocabularyTerm> = [];
  appStatusList: Array<VocabularyTerm> = [];
  publicDomainList: Array<VocabularyTerm> = [];
  appSubTypeList: Array<VocabularyTerm> = [];

  constructor(
    public applicationService: ApplicationService,
    public activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
    public authService: AuthService,
    public cvService: ControlledVocabularyService) { }

  ngOnInit() {

    this.applicationService.loadApplication();
    this.application = this.applicationService.application;
    this.getVocabularies();
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('CENTER', 'APPLICATION_TYPE',
    'APPLICATION_STATUS', 'PUBLIC_DOMAIN', 'APPLICATION_SUB_TYPE').subscribe(response => {
      this.centerList = response['CENTER'].list;
      this.appTypeList = response['APPLICATION_TYPE'].list;
      this.appStatusList = response['APPLICATION_STATUS'].list;
      this.publicDomainList = response['PUBLIC_DOMAIN'].list;
      this.appSubTypeList = response['APPLICATION_SUB_TYPE'].list;
    });
  }

}
