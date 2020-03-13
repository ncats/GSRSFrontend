import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { JsonDialogFdaComponent } from '../application-form/json-dialog-fda/json-dialog-fda.component';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit, AfterViewInit, OnDestroy {

  application: ApplicationSrs;
  centerList: Array<VocabularyTerm> = [];
  appTypeList: Array<VocabularyTerm> = [];
  appStatusList: Array<VocabularyTerm> = [];
  publicDomainList: Array<VocabularyTerm> = [];
  appSubTypeList: Array<VocabularyTerm> = [];

  id?: number;
  isLoading = true;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    private cvService: ControlledVocabularyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog) { }

  ngOnInit() {
    /*
     this.loadingService.setLoading(true);
     this.applicationService.loadApplication();
     this.application = this.applicationService.application;
     this.getVocabularies();
 */

    this.loadingService.setLoading(true);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    const routeSubscription = this.activatedRoute
      .params
      .subscribe(params => {
        if (params['id']) {
          const id = params['id'];
          if (id !== this.id) {
            this.id = id;
            this.gaService.sendPageView(`Application Edit`);
            this.getApplicationDetails();
            this.getVocabularies();
          }
        } else {
          setTimeout(() => {
            this.gaService.sendPageView(`Application Register`);
            this.applicationService.loadApplication();
            this.application = this.applicationService.application;
            this.getVocabularies();
            this.loadingService.setLoading(false);
            this.isLoading = false;
          });
        }
      });
    this.subscriptions.push(routeSubscription);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    // this.applicationService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getApplicationDetails(newType?: string): void {
    this.applicationService.getApplicationDetails(this.id).subscribe(response => {
      if (response) {
        this.applicationService.loadApplication(response);
        this.application = this.applicationService.application;
        console.log(this.application);
      } else {
        this.handleApplicationRetrivalError();
      }
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }, error => {
      this.gaService.sendException('getApplicationDetails: error from API call');
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.handleApplicationRetrivalError();
    });
  }

  private handleApplicationRetrivalError() {
    const notification: AppNotification = {
      message: 'The application you\'re trying to edit doesn\'t exist.',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/application/register']);
      this.applicationService.loadApplication();
    }, 5000);
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

  showJSON(): void {
    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%'
    });

   // this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);

  }

}
