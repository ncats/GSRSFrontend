import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
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
import { ApplicationSrs, ValidationMessage } from '../model/application.model';
import { Subscription } from 'rxjs';
import {take} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { JsonDialogFdaComponent } from '../application-form/json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent} from '../application-form/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  showSubmissionMessages = false;
  submissionMessage: string;
  validationMessages: Array<ValidationMessage>;
  validationResult = false;
  private subscriptions: Array<Subscription> = [];
  copy: string;
  private overlayContainer: HTMLElement;
  serverError: boolean;
  isDisableData = false;

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

        // Check if Data is from external source, and Disable some fields.
        if (this.application) {
          if (this.application.provenance) {
            if (this.application.provenance.toLowerCase() === 'darrts') {
              this.isDisableData = true;
            }
          }
        }
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

  validate(validationType?: string ): void {
    this.isLoading = true;
    this.serverError = false;
    this.loadingService.setLoading(true);
    this.applicationService.validateApplication().pipe(take(1)).subscribe(results => {
      this.submissionMessage = null;
      this.validationMessages = results.validationMessages.filter(
        message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
      this.validationResult = results.valid;
      this.showSubmissionMessages = true;
      this.loadingService.setLoading(false);
      this.isLoading = false;
      if (this.validationMessages.length === 0 && results.valid === true) {
        this.submissionMessage = 'Application is Valid. Would you like to submit?';
      }
    }, error => {
      this.addServerError(error);
      this.loadingService.setLoading(false);
      this.isLoading = false;
    });

    /*
    this.isLoading = false;
    this.validationResult = true;
    this.showSubmissionMessages = true;
    this.submissionMessage = 'Application is Valid. Would you like to submit?';
    */
  }

  toggleValidation(): void {
    this.showSubmissionMessages = !this.showSubmissionMessages;
  }

  addServerError (error: any): void {
    this.serverError = true;
    this.validationResult = false;
    this.validationMessages = null;

    const message: ValidationMessage = {
      actionType: 'server failure',
      links: [],
      appliedChange: false,
      suggestedChange: false,
      messageType : 'ERROR',
      message : 'Unknown Server Error'
    };
    if ( error && error.error && error.error.message ) {
      message.message =  'Server Error ' + (error.status + ': ' || ': ') + error.error.message;
    } else if ( error && error.error && (typeof error.error) === 'string') {
        message.message = 'Server Error ' + (error.status + ': ' || '') + error.error;
    } else if ( error && error.message ) {
      message.message = 'Server Error ' + (error.status + ': ' || '') + error.message;
    }
    this.validationMessages = [message];
    this.showSubmissionMessages = true;
  }

  submit(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    this.applicationService.saveApplication().subscribe(response => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.submissionMessage = 'Application was saved successfully!';
      this.showSubmissionMessages = true;
      this.validationResult = false;
      setTimeout(() => {
        this.showSubmissionMessages = false;
        this.submissionMessage = '';
        if (!this.id) {
          this.id = response.id;
          this.router.navigate(['/application', response.id, 'edit']);
        }
      }, 4000);
    }
    /*
    , (error: SubstanceFormResults) => {
      this.showSubmissionMessages = true;
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.submissionMessage = null;
      if (error.validationMessages && error.validationMessages.length) {
        this.validationResult = error.isSuccessfull;
        this.validationMessages = error.validationMessages
          .filter(message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
        this.showSubmissionMessages = true;
      } else {
        this.submissionMessage = 'There was a problem with your submission';
        this.addServerError(error.serverError);
        setTimeout(() => {
          this.showSubmissionMessages = false;
          this.submissionMessage = null;
        }, 8000);
      }
    }*/
    );
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

  addNewIndication() {
    this.applicationService.addNewIndication();
  }

  confirmDeleteIndication(indIndex: number, indication: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete Indication (' + (indIndex + 1) + ')?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        console.log(result);
          this.deleteIndication(indIndex);
      }
    });
  }

  deleteIndication(indIndex: number) {
    this.applicationService.deleteIndication(indIndex);
  }

}
