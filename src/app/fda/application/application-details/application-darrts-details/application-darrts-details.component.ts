import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../service/application.service';
import { GeneralService } from '../../../service/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../../core/utils/utils.service';
// import { AuthService } from '@gsrs-core/auth/auth.service';
import { ApplicationDetailsBaseComponent } from '../application-details-base.component';
import { element } from 'protractor';

@Component({
  selector: 'app-application-darrts-details',
  templateUrl: './application-darrts-details.component.html',
  styleUrls: ['./application-darrts-details.component.scss']
})

export class ApplicationDarrtsDetailsComponent extends ApplicationDetailsBaseComponent implements OnInit {

  constructor(
    public applicationService: ApplicationService,
    public generalService: GeneralService,
    activatedRoute: ActivatedRoute,
    loadingService: LoadingService,
    mainNotificationService: MainNotificationService,
    router: Router,
    gaService: GoogleAnalyticsService,
    utilsService: UtilsService,
    // authService: AuthService,
  ) {
    super(applicationService, generalService, activatedRoute, loadingService, mainNotificationService, router, gaService, utilsService);
    // , authService);
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
  }

  getApplicationDarrtsDetails(): void {
    const appDarrtsSubscription = this.applicationService.getApplicationDarrtsDetails(this.appType, this.appNumber).subscribe(response => {
      this.application = response;
      if (response) {
        this.getSubstanceBySubstanceKey();
      }
      this.loadingService.setLoading(false);
    }, error => {
     // this.handleSubstanceRetrivalError();
      this.message = 'No Application (Darrts) record found';
      this.loadingService.setLoading(false);
    });
    this.subscriptions.push(appDarrtsSubscription);

  }

  getSubstanceBySubstanceKey() {
    if (this.application != null) {
      this.application.ingredientList.forEach(elementIngred => {

        if (elementIngred != null) {
          // Get Substance Details, uuid, approval_id, substance name
          if (elementIngred.substanceKey) {
            const subSubscription = this.generalService.getSubstanceByAnyId(elementIngred.substanceKey).subscribe(response => {
              if (response) {
                elementIngred._substanceUuid = response.uuid;
                elementIngred._ingredientname = response._name;
                elementIngred._approvalID = response._approvalIDDisplay;
              }
            });
            this.subscriptions.push(subSubscription);


            // Get Substance Key Parent Concept
            const conceptSubscription = this.applicationService.getSubstanceParentConcept(elementIngred.substanceKey).subscribe(response => {
              if (response) {
                elementIngred._parentSubstanceKey = response.parentSubstanceKey;
                elementIngred._parentDisplayTerm = response.parentDisplayTerm;
              }
            });
            this.subscriptions.push(conceptSubscription);

          }
        }
      });
    }
  }

}
