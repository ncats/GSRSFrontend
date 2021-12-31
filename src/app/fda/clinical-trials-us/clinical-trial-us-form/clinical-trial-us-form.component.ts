import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ClinicalTrialUSService } from '../service/clinical-trial-us.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ControlledVocabularyService } from '../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../core/controlled-vocabulary/vocabulary.model';
import { ClinicalTrialUS, ClinicalTrialUSDrug, ValidationMessage } from '../model/clinical-trial-us.model';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { GeneralService } from '../../service/general.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as _ from 'lodash';

@Component({
  selector: 'app-clinical-trial-us-form',
  templateUrl: './clinical-trial-us-form.component.html',
  styleUrls: ['./clinical-trial-us-form.component.scss']
})

export class ClinicalTrialUSFormComponent implements OnInit, AfterViewInit, OnDestroy {

  clinicalTrialUS: ClinicalTrialUS;
  trialNumber?: string;
  isLoading = true;
  showSubmissionMessages = false;
  submissionMessage: string;
  validationMessages: Array<ValidationMessage> = [];
  validationResult = false;
  private subscriptions: Array<Subscription> = [];
  copy: string;
  private overlayContainer: HTMLElement;
  serverError: boolean;
  isDisableData = false;
  username = null;
  title = null;
  isAdmin = false;
  expiryDateMessage = '';
  manufactureDateMessage = '';
  viewClinicalTrialUSUrl = '';
  message = '';
  newSubstancesText = '';
  newSubstancesTextSubmitted = false;
  newSubstancesTextList: Array<string>;
  newSubstances: Array<ClinicalTrialUSDrug>;
  showAddNewSubstancesTextArea = false;
  newSubstancesMessage = '';

  constructor(
    private clinicalTrialUSService: ClinicalTrialUSService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private generalService: GeneralService,

    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    private cvService: ControlledVocabularyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.isAdmin = this.authService.hasRoles('admin');
    this.loadingService.setLoading(true);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.username = this.authService.getUser();
    const routeSubscription = this.activatedRoute
      .params
      .subscribe(params => {
        if (params['trialNumber']) {
          const trialNumber = params['trialNumber'];
          this.title = 'Update US Clinical Trial';
          if (trialNumber !== this.trialNumber) {
            this.trialNumber = trialNumber;
            this.gaService.sendPageView(`Clinical Trial US Edit`);
            this.getClinicalTrialUSDetails();
          }
        } else {
          this.title = 'Register New US Clinical Trial US';
          setTimeout(() => {
            this.gaService.sendPageView(`Clinical Trial US Register`);
            this.clinicalTrialUSService.loadClinicalTrialUS();
            this.clinicalTrialUS = this.clinicalTrialUSService.clinicalTrialUS;
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
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getClinicalTrialUSDetails(newType?: string): void {
    if (this.trialNumber != null) {
      const trialNumber = this.trialNumber.toString();
      this.clinicalTrialUSService.getClinicalTrialUS(trialNumber, 'srs').subscribe(response => {
        if (response) {
          this.clinicalTrialUSService.loadClinicalTrialUS(response);
          this.clinicalTrialUS = this.clinicalTrialUSService.clinicalTrialUS;
        } else {
          this.handleClinicalTrialUSRetrivalError();
        }
        this.loadingService.setLoading(false);
        this.isLoading = false;
      }, error => {
        this.message = 'No US Clinical Trial Record found for Trial Number ' + this.trialNumber;
        this.gaService.sendException('getClinicalTrialUSDetails: error from API call');
        this.loadingService.setLoading(false);
        this.isLoading = false;
        this.handleClinicalTrialUSRetrivalError();
      });
    }
  }

  validate(validationType?: string): void {
    this.isLoading = true;
    this.serverError = false;
    this.loadingService.setLoading(true);

    this.validateClient();
    // If there is no error on client side, check validation on server side
    if (this.validationMessages.length === 0) {
      console.log('inside before success in validate() 1');

      this.showSubmissionMessages = false;
      this.clinicalTrialUSService.validateClinicalTrialUS().pipe(take(1)).subscribe(results => {
        console.log('inside success in validate() 2');
console.log(results);
        this.submissionMessage = null;
        this.validationMessages = results.validationMessages.filter(
          message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
        this.validationResult = results.valid;
        this.showSubmissionMessages = true;
        this.loadingService.setLoading(false);
        this.isLoading = false;
        if (this.validationMessages.length === 0 && results.valid === true) {
          this.submissionMessage = 'US Clinical Trial is valid. Would you like to submit?';
        }
      }, error => {
        console.log('inside error in validate() 3');
        this.addServerError(error);
        this.loadingService.setLoading(false);
        this.isLoading = false;
      });
    }
  }

  setValidationMessage(message: string) {
    const validate: ValidationMessage = {};
    validate.message = message;
    validate.messageType = 'ERROR';
    this.validationMessages.push(validate);
    this.validationResult = false;
  }

  // Validate data in client side first
  validateClient(): void {
    console.log('inside validateClient()');

    this.validationMessages = [];
    this.validationResult = true;

    if (this.validationMessages.length > 0) {
      this.showSubmissionMessages = true;
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }

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

  submit(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    this.clinicalTrialUSService.saveClinicalTrialUS().subscribe(response => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.submissionMessage = 'US Clinical Trial was saved successfully!';
      this.showSubmissionMessages = true;
      this.validationResult = false;
      setTimeout(() => {
        this.showSubmissionMessages = false;
        this.submissionMessage = '';
        if (response.trialNumber) {
          this.clinicalTrialUSService.bypassUpdateCheck();
          const trialNumber = response.trialNumber;
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/clinical-trial-us', trialNumber, 'edit']);
        }
      }, 4000);
    }
    // archana had this code commented out
    // but without it you get spinner on 500 error
      , (error
        //: SubstanceFormResults
        ) => {
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
      }
    );
  }

  private handleClinicalTrialUSRetrivalError() {
    const notification: AppNotification = {
      message: 'The US Clinical Trial you\'re trying to edit doesn\'t exist.',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/clinical-trial-us/register']);
      this.clinicalTrialUSService.loadClinicalTrialUS();
    }, 5000);
  }

  showJSON(): void {
    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: this.clinicalTrialUS
    });

    // this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);

  }

  confirmDeleteClinicalTrialUS(trialNumber: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this US Clinical Trial?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteClinicalTrialUS(trialNumber);
      }
    });
  }

  deleteClinicalTrialUS(trialNumber: string): void {
    this.clinicalTrialUSService.deleteClinicalTrialUS(trialNumber).subscribe(response => {
      this.clinicalTrialUSService.bypassUpdateCheck();
      this.displayMessageAfterDeleteClinicalTrialUS();
    }, (err) => {
      console.log(err);
    }
    );
  }

  displayMessageAfterDeleteClinicalTrialUS() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'This US Clinical Trial record was deleted successfully',
        type: 'home'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/home']);
    });
  }


  isNumber(str: any): boolean {
    if (str) {
      const num = Number(str);
      const nan = isNaN(num);
      return !nan;
    }
    return false;
  }

  getViewClinicalTrialUSUrl(): string {
    return this.clinicalTrialUSService.getViewClinicalTrialUSUrl(this.trialNumber);
  }

  addNewSubstance(clinicalTrialUSDrug?: ClinicalTrialUSDrug) {
    this.clinicalTrialUSService.addNewSubstance(clinicalTrialUSDrug);
  }

  addNewSubstances() {
    this.newSubstancesMessage = '';
    this.newSubstancesTextSubmitted = true;
    this.parseNewSubstancesText();
    let lines = 0;
    let added = 0;
    let alreadyPresent = 0;
    const substanceKeyHash = {};
    _.map(this.clinicalTrialUS.clinicalTrialUSDrug, 'substanceKey').forEach(key => {
      substanceKeyHash[key] = 1;
    });
    this.newSubstancesTextList.forEach(line => {
      lines++;
      const substance: ClinicalTrialUSDrug = {};
      substance.substanceKey = line;
      substance.substanceKeyType = 'UUID';
      if (substanceKeyHash.hasOwnProperty(line)) {
        alreadyPresent++;
      } else {
        added++;
        this.addNewSubstance(substance);
      }
    });
    this.newSubstancesMessage = `Lines: ${lines}. Added: ${added}. Already present: ${alreadyPresent}`;
  }

  unlockNewSubstancesTextSubmitted() {
    this.newSubstancesTextSubmitted = false;
  }

 setShowAddNewSubstancesTextArea(b: boolean) {
    this.showAddNewSubstancesTextArea = b;
  }

  parseNewSubstancesText() {
    if (this.newSubstancesText != null) {
      const newSubstancesTextCleaned = this.newSubstancesText.replace(/<\/?[^>]+(>|$)/g, '');
      console.log('newSubstancesTextCleaned: ');
      console.log(newSubstancesTextCleaned);

      this.newSubstancesTextList = newSubstancesTextCleaned.split(/[\r\n]+/);
      console.log('array lines: ');
      console.log(this.newSubstancesTextList);
    }
  }

}
