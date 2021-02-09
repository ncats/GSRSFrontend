import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Impurities, ImpuritiesDetails, ImpuritiesUnspecified, SubRelationship, ValidationMessage } from '../model/impurities.model';
import { ImpuritiesService } from '../service/impurities.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { ControlledVocabularyService } from '../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FormBuilder } from '@angular/forms';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-form',
  templateUrl: './impurities-form.component.html',
  styleUrls: ['./impurities-form.component.scss']
})
export class ImpuritiesFormComponent implements OnInit, OnDestroy {

  isLoading = true;
  showSubmissionMessages = false;
  submissionMessage: string;
  validationMessages: Array<ValidationMessage> = [];
  validationResult = false;
  private subscriptions: Array<Subscription> = [];
  copy: string;
  private overlayContainer: HTMLElement;
  serverError: boolean;
  searchValue: string;
  errorMessage: string;
  subName = 'Substance Name *';
  impurities: Impurities;
  substanceId = null;
  id?: number;
  isDisableData = false;
  username = null;
  title = null;
  submitDateMessage = '';
  statusDateMessage = '';
  isAdmin = false;
  subRelationship: Array<SubRelationship> = [];
  substanceName: string;
  substanceNameHintMessage = '';

  constructor(
    private impuritiesService: ImpuritiesService,
    private substanceService: SubstanceService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    private cvService: ControlledVocabularyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
    private fb: FormBuilder) { }

  ngOnInit() {

    const rolesSubscription = this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
      this.isAdmin = response;
    });
    this.subscriptions.push(rolesSubscription);

    this.loadingService.setLoading(true);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.username = this.authService.getUser();
    const routeSubscription = this.activatedRoute
      .params
      .subscribe(params => {
        if (params['id']) {
          const id = params['id'];
          this.title = 'Update Impurity';
          if (id !== this.id) {
            this.id = id;
            this.gaService.sendPageView(`Impurity Edit`);
            this.getImpurities();
            //   this.getVocabularies();
          }
        } else {
          this.title = 'Register Impurities';
          setTimeout(() => {
            this.gaService.sendPageView(`Impurities Register`);
            this.impuritiesService.loadImpurities();
            this.impurities = this.impuritiesService.impurities;

            // this.impurities.substanceUuid = '479f1396-4958-4f59-9d41-0bd0468c8da7';

            this.loadingService.setLoading(false);
            this.isLoading = false;
          });
        }
      });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy(): void {
    // this.applicationService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getImpurities(newType?: string): void {
    if (this.id != null) {
      const id = this.id.toString();
      const getImpuritySubscribe = this.impuritiesService.getImpurities(id).subscribe(response => {
        if (response) {
          this.impuritiesService.loadImpurities(response);
          this.impurities = this.impuritiesService.impurities;

         // if (this.impurities.substanceUuid) {
         //   this.getSubstancePreferredName(this.impurities.substanceUuid);
        //  }
        } else {
          this.handleProductRetrivalError();
        }
        this.loadingService.setLoading(false);
        this.isLoading = false;
      }, error => {
        this.gaService.sendException('getImpurities: error from API call');
        this.loadingService.setLoading(false);
        this.isLoading = false;
        this.handleProductRetrivalError();
      });
      this.subscriptions.push(getImpuritySubscribe);
    }
  }

  validate(): void {

    if ((this.impurities.impuritiesSubstanceList[0].substanceUuid === null)
     || (this.impurities.impuritiesSubstanceList[0].substanceUuid === undefined)) {
      this.substanceNameHintMessage = 'Substance Name is required';
    }

    //  if (this.impurities.substanceUuid) {
    this.isLoading = true;
    this.serverError = false;
    this.loadingService.setLoading(true);

    // If there is no error on client side, check validation on server side
    if (this.validationMessages.length === 0) {
      // this.impuritiesService.validateImpurities().pipe(take(1)).subscribe(results => {
      this.submissionMessage = null;
      //   this.validationMessages = results.validationMessages.filter(
      //      message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
      //   this.validationResult = results.valid;

      this.validationResult = true;
      this.showSubmissionMessages = true;
      this.loadingService.setLoading(false);
      this.isLoading = false;


      if (this.validationMessages.length === 0 && this.validationResult === true) {
        this.submissionMessage = 'Impurities is Valid. Would you like to submit?';
      }
      /* }, error => {
         this.addServerError(error);
         this.loadingService.setLoading(false);
         this.isLoading = false;
       });
       */
    }
    //  }

  }

  toggleValidation(): void {
    this.showSubmissionMessages = !this.showSubmissionMessages;
  }

  addServerError(error: any): void {
    this.serverError = true;
    this.validationResult = false;
    this.validationMessages = null;

    const message: ValidationMessage = {
      actionType: 'server failure',
      links: [],
      appliedChange: false,
      suggestedChange: false,
      messageType: 'ERROR',
      message: 'Unknown Server Error'
    };
    if (error && error.error && error.error.message) {
      message.message = 'Server Error ' + (error.status + ': ' || ': ') + error.error.message;
    } else if (error && error.error && (typeof error.error) === 'string') {
      message.message = 'Server Error ' + (error.status + ': ' || '') + error.error;
    } else if (error && error.message) {
      message.message = 'Server Error ' + (error.status + ': ' || '') + error.message;
    }
    this.validationMessages = [message];
    this.showSubmissionMessages = true;
  }

  private handleProductRetrivalError() {
    const notification: AppNotification = {
      message: 'The impurities you\'re trying to edit doesn\'t exist.',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/impurities/register']);
      this.impuritiesService.loadImpurities();
    }, 5000);
  }

  submit(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    this.impuritiesService.saveImpurities().subscribe(response => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.submissionMessage = 'Impurities was saved successfully!';
      this.showSubmissionMessages = true;
      this.validationResult = false;
      setTimeout(() => {
        this.showSubmissionMessages = false;
        this.submissionMessage = '';
        if (response.id) {
          const id = response.id;
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          //  this.router.navigate(['/impuritiesDetails', id, 'edit']);
          this.router.navigate(['/impurities', id]);
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

  getImpuritiesDetails() {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    this.errorMessage = 'Getting Existing Impurities...';

    // Empty the Impurities Details list
    //  this.impurities.impuritiesDetailsList.splice(0, this.impurities.impuritiesDetailsList.length);

    const substanceUuid = this.impurities.impuritiesSubstanceList[0].substanceUuid;
    if (substanceUuid) {
      const getRelImpuritySubscribe = this.impuritiesService.getRelationshipImpurity(substanceUuid).subscribe(response => {
        if (response) {
          this.subRelationship = response.data;

          if (Object.keys(this.subRelationship).length > 0) {
            this.getRelationship();
          } else {
            this.errorMessage = 'No Impurities found';
          }
        }
      });
      this.subscriptions.push(getRelImpuritySubscribe);
    } else {
      this.errorMessage = 'Please select a Substance Name';
    }

    this.loadingService.setLoading(false);
    this.isLoading = false;
  }

  getSubstancePreferredName(substanceUuid: string): void {
    const getSubDetailsSubscribe = this.impuritiesService.getSubstanceDetailsBySubstanceId(substanceUuid).subscribe(substanceNames => {
      this.searchValue = substanceNames.name;
    });
    this.subscriptions.push(getSubDetailsSubscribe);

  }

  getRelationship() {
    this.errorMessage = 'Found ' + this.subRelationship.length + ' Existing Impurities';
    // Add New Test
    this.impuritiesService.addNewTest();
    this.subRelationship.forEach((elementRel, indexRel) => {
      this.createNewImpurities(elementRel.relationshipUuid);
    });
  }

  createNewImpurities(relationshipUuid: string) {
    const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
    newImpuritiesDetails.relatedSubstanceUuid = relationshipUuid;
    this.impurities.impuritiesTestList[0].impuritiesDetailsList.unshift(newImpuritiesDetails);
  }

  showJSON(): void {
    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: this.impurities
    });

    //   this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);

  }

  addNewImpuritiesSubstance() {
    this.impuritiesService.addNewImpuritiesSubstance();
  }

  addNewTest() {
    this.impuritiesService.addNewTest();
  }

  addNewImpurities() {
    this.impuritiesService.addNewImpurities();
  }

  addNewImpuritiesUnspecified() {
    this.impuritiesService.addNewImpuritiesUnspecified();
  }

  addNewImpuritiesTotal() {
    this.impuritiesService.addNewImpuritiesTotal();
  }

  confirmDeleteImpuritiesSubstance(impuritiesSubstanceIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Substance ' + (impuritiesSubstanceIndex + 1) + '?' }
    });

    const closediagSubscribe = dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesSubstance(impuritiesSubstanceIndex);
      }
    });
    this.subscriptions.push(closediagSubscribe);
  }

  deleteImpuritiesSubstance(impuritiesSubstanceIndex: number) {
    this.impuritiesService.deleteImpuritiesSubstance(impuritiesSubstanceIndex);
  }

  getRelationshipImpurity(substanceId: string) {
    this.impuritiesService.getRelationshipImpurity(substanceId);
  }

  relatedSubstanceUpdated(substance: any, impuritiesSubstanceIndex: number): void {
    if (substance != null) {
      this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].substanceUuid = substance.uuid;
    }
  }

  processSubstanceSearch(searchValue: string = ''): void {
    // Remove double quote
    this.searchValue = searchValue.replace(/"/g, '');
    this.substanceNameHintMessage = '';
    const getQuickSumSubscribe = this.substanceService.getQuickSubstancesSummaries(this.searchValue, true).subscribe(response => {
      if (response.content && response.content.length) {
        const selectedSubstance = response.content[0];
     //   this.impurities.substanceUuid = selectedSubstance.uuid;
        this.errorMessage = '';
      } else {
        this.errorMessage = 'No substances found';
      }
    });
    this.subscriptions.push(getQuickSumSubscribe);
  }

}
