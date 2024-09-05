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
import { Application, ValidationMessage } from '../model/application.model';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { finalize } from 'rxjs/operators';
import { CvInputComponent } from '@gsrs-core/substance-form/cv-input/cv-input.component';
import { anyExistsFilter } from '@gsrs-core/substance-details';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { element } from 'protractor';
import { GeneralService } from '../../service/general.service';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  // encapsulation: ViewEncapsulation.None
})

export class ApplicationFormComponent implements OnInit, AfterViewInit, OnDestroy {

  application: Application;
  /*
  centerList: Array<VocabularyTerm> = [];
  appTypeList: Array<VocabularyTerm> = [];
  appStatusList: Array<VocabularyTerm> = [];
  publicDomainList: Array<VocabularyTerm> = [];
  appSubTypeList: Array<VocabularyTerm> = [];
*/

  id?: number;
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
  submitDateMessage = '';
  statusDateMessage = '';
  appForm: FormGroup;
  isAdmin = false;

  constructor(
    private applicationService: ApplicationService,
    private generalService: GeneralService,
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
    private fb: FormBuilder,
    private titleService: Title) { }

  // get submitDateControl() { return this.appForm.get('submitDateControl'); }

  ngOnInit() {
    // this.generateFormContorls();
    this.isAdmin = this.authService.hasRoles('admin');
    this.loadingService.setLoading(true);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.username = this.authService.getUser();
    const routeSubscription = this.activatedRoute
      .params
      .subscribe(params => {
        if (params['id']) {
          const id = params['id'];
          this.title = 'Update Application';
          if (id !== this.id) {
            this.id = id;
            this.gaService.sendPageView(`Application Edit`);
            this.getApplicationDetails();
          }
        } else {
          this.title = 'Register New Application';
          setTimeout(() => {
            this.gaService.sendPageView(`Application Register`);
            this.titleService.setTitle(`Register Application`);
            this.applicationService.loadApplication();
            this.application = this.applicationService.application;
            this.loadingService.setLoading(false);
            this.isLoading = false;
          });
        }
      }, error => {
        this.loadingService.setLoading(false);
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
    this.applicationService.getApplicationById(this.id).subscribe(response => {
      if (response) {
        this.applicationService.loadApplication(response);
        this.application = this.applicationService.application;

        // Check if Data is from external source, and Disable some fields.
        if (this.application) {
          this.titleService.setTitle(`Edit Application ` + this.application.appType + ' ' + this.application.appNumber);
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

  validate(validationType?: string): void {
    this.isLoading = true;
    this.serverError = false;
    this.loadingService.setLoading(true);

    this.validateClient();
    // If there is no error on client side, check validation on server side
    if (this.validationMessages.length === 0) {
      this.applicationService.validateApplication().pipe(take(1)).subscribe(results => {
        this.submissionMessage = null;
        this.validationMessages = results.validationMessages.filter(
          message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
        this.validationResult = results.valid;
        this.showSubmissionMessages = true;
        this.loadingService.setLoading(false);
        this.isLoading = false;
        if (this.validationMessages.length === 0 && this.validationResult === true) {
          this.submissionMessage = 'Application is Valid. Would you like to submit?';
        }
      }, error => {
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
    this.submissionMessage = null;
    this.validationMessages = [];
    this.validationResult = true;

    // Validate Center in application
    if ((this.application.center == null) || (this.application.center != null && this.application.center.length < 1)) {
      this.setValidationMessage('Center is required');
    }

    // Validate Application Type in application
    if ((this.application.appType == null) || (this.application.appType != null && this.application.appType.length < 1)) {
      this.setValidationMessage('Application Type is required');
    }

    // Validate Application Number in application
    if ((this.application.appNumber == null) || (this.application.appNumber != null && this.application.appNumber.length < 1)) {
      this.setValidationMessage('Application Number is required');
    }

    // Validate Submit Date in application
    if ((this.submitDateMessage !== null) && (this.submitDateMessage.length > 0)) {
      this.setValidationMessage(this.submitDateMessage);
    }

    // Validate Status Date in application
    if ((this.statusDateMessage !== null) && (this.statusDateMessage.length > 0)) {
      this.setValidationMessage(this.statusDateMessage);
    }

    // Validate Product Amount, which should be integer/number
    if (this.application != null) {
      this.application.applicationProductList.forEach(elementProd => {
        if (elementProd != null) {
          if (elementProd.amount) {
            if (this.isNumber(elementProd.amount) === false) {
              this.setValidationMessage('Amount must be a number');
            }
          }

          // Validate Ingredient Average, Low, High, LowLimit, HighLimit should be integer/number
          elementProd.applicationIngredientList.forEach(elementIngred => {
            if (elementIngred != null) {
              if (elementIngred.average) {
                if (this.isNumber(elementIngred.average) === false) {
                  this.setValidationMessage('Average must be a number');
                }
              }
              if (elementIngred.low) {
                if (this.isNumber(elementIngred.low) === false) {
                  this.setValidationMessage('Low must be a number');
                }
              }
              if (elementIngred.high) {
                if (this.isNumber(elementIngred.high) === false) {
                  this.setValidationMessage('High must be a number');
                }
              }
              if (elementIngred.lowLimit) {
                if (this.isNumber(elementIngred.lowLimit) === false) {
                  this.setValidationMessage('Low Limit must be a number');
                }
              }
              if (elementIngred.highLimit) {
                if (this.isNumber(elementIngred.highLimit) === false) {
                  this.setValidationMessage('High Limit must be a number');
                }
              }
              // Ingredient Name Validation
              if (elementIngred.$$ingredientNameValidation) {
                this.setValidationMessage(elementIngred.$$ingredientNameValidation);
              }
              // Basis of Strength Validation
              if (elementIngred.$$basisOfStrengthValidation) {
                this.setValidationMessage(elementIngred.$$basisOfStrengthValidation);
              }
            }
          });

        }
      });
    }

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
    // remove non-field form property/field/key from Application object
    this.application = this.cleanApplication();
    if (this.application) {
      if (this.application.id) {
      } else {
        if (this.application.provenance === null || this.application.provenance === undefined) {
          // Set Provenance to GSRS
          this.application.provenance = 'GSRS';
        }
      }
      // Set service application
      this.applicationService.application = this.application;
    }

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
        if (response.id) {
          this.applicationService.bypassUpdateCheck();
          const id = response.id;
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/application', id, 'edit']);
        }
      }, 4000);
    }, error => {
      this.loadingService.setLoading(false);
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
    /*  this.cvService.getDomainVocabulary('CENTER', 'APPLICATION_TYPE',
        'APPLICATION_STATUS', 'PUBLIC_DOMAIN', 'APPLICATION_SUB_TYPE').subscribe(response => {
          this.centerList = response['CENTER'].list;
          this.appTypeList = response['APPLICATION_TYPE'].list;
          this.appStatusList = response['APPLICATION_STATUS'].list;
          this.publicDomainList = response['PUBLIC_DOMAIN'].list;
          this.appSubTypeList = response['APPLICATION_SUB_TYPE'].list;
        });
        */
  }

  confirmDeleteApplication() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this Application?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteApplication();
      }
    });
  }

  deleteApplication(): void {
    this.applicationService.deleteApplication().subscribe(response => {
      this.applicationService.bypassUpdateCheck();
      this.displayMessageAfterDeleteApp();
    }, (err) => {
      console.log(err);
    }
    );
  }

  displayMessageAfterDeleteApp() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'This application record was deleted successfully',
        type: 'home'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/home']);
    });
  }

  cleanApplication(): Application {
    let applicationStr = JSON.stringify(this.application);
    let applicationCopy: Application = JSON.parse(applicationStr);
    applicationCopy.applicationProductList.forEach(elementProd => {
      if (elementProd != null) {
        elementProd.applicationIngredientList.forEach(elementIngred => {
          if (elementIngred != null) {
            // remove property for Ingredient Name Validation. Do not need in the form JSON
            if (elementIngred.$$ingredientNameValidation || elementIngred.$$ingredientNameValidation === "") {
              delete elementIngred.$$ingredientNameValidation;
            }
            // remove property for Basis of Strength Validation. Do not need in the form JSON
            if (elementIngred.$$basisOfStrengthValidation || elementIngred.$$basisOfStrengthValidation === "") {
              delete elementIngred.$$basisOfStrengthValidation;
            }
          }
        });
      }
    });
    return applicationCopy;
  }

  showJSON(): void {
    const date = new Date();
    let jsonFilename = 'application_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    let cleanApplication = this.cleanApplication();

    let data = {jsonData: cleanApplication, jsonFilename: jsonFilename};

    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: data
    });

    //   this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  addNewIndication() {
    this.applicationService.addNewIndication();
  }

  confirmDeleteIndication(indIndex: number, indication: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Indication (' + (indIndex + 1) + ')?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteIndication(indIndex);
      }
    });
  }

  deleteIndication(indIndex: number) {
    this.applicationService.deleteIndication(indIndex);
  }

  validateSubmitDate() {
    this.submitDateMessage = '';
    const isValid = this.validateDate(this.application.submitDate);
    if (isValid === false) {
      this.submitDateMessage = 'Submit Date is invalid';
    } else {
      const isValid = this.validateSubmitDateWithStatusDate(this.application.submitDate, this.application.statusDate);
      if (isValid === false) {
        this.submitDateMessage = 'Submit Date should be earlier than Status Date;';
      }
    }
  }

  validateStatusDate() {
    this.statusDateMessage = '';
    let isValid = this.validateDate(this.application.statusDate);
    if (isValid === false) {
      this.statusDateMessage = 'Status Date is invalid';
    } else {
      isValid = this.validateFutureDate(this.application.statusDate);
      if (isValid === false) {
        this.statusDateMessage = 'Status Date should not be a future date';
      } else {
        isValid = this.validateSubmitDateWithStatusDate(this.application.submitDate, this.application.statusDate);
        if (isValid === false) {
          this.submitDateMessage = 'Submit Date should be earlier than Status Date;';
        }
      }
    }
  }

  validateFutureDate(dateinput: any): boolean {
    let isValid = true;
    // compare if the entered date is future date or not
    const now = new Date();
    const nowDate = now.setHours(0, 0, 0);
    if ((dateinput !== null) && (dateinput.length > 0)) {
      if ((dateinput.length >= 8) || (dateinput.length <= 10)) {
        const enteredDate = new Date(dateinput);
        const enteredDateOnly = enteredDate.setHours(0, 0, 0);
        if (enteredDateOnly > nowDate) {
          isValid = false;
        }
      }
    }
    return isValid;
  }

  validateSubmitDateWithStatusDate(submitDateInput: any, statusDateInput: any): boolean {
    let isValid = true;
    // Submit Date should not be later than Status Date.
    if ((submitDateInput) && (statusDateInput)) {
      const submitDt = new Date(submitDateInput).setHours(0, 0, 0);
      const statusDt = new Date(statusDateInput).setHours(0, 0, 0);
      if (submitDt > statusDt) {
        isValid = false;
      }
    }
    return isValid;
  }

  validateDate(dateinput: any): boolean {
    let isValid = true;
    if ((dateinput !== null) && (dateinput.length > 0)) {
      if ((dateinput.length < 8) || (dateinput.length > 10)) {
        return false;
      }
      const split = dateinput.split('/');
      if (split.length !== 3 || (split[0].length < 1 || split[0].length > 2) ||
        (split[1].length < 1 || split[1].length > 2) || split[2].length !== 4) {
        return false;
      }
      if (split.length === 3) {
        const comstring = split[0] + split[1] + split[2];
        for (let i = 0; i < split.length; i++) {
          const valid = this.isNumber(split[i]);
          if (valid === false) {
            isValid = false;
            break;
          }
        }
      }
    }
    return isValid;
  }

  isNumber(str: any): boolean {
    if (str) {
      const num = Number(str);
      const nan = isNaN(num);
      return !nan;
    }
    return false;
  }

  convertDateFormat(formDate: any): any {
    if (formDate !== null) {
      const datepipe = new DatePipe('en-US');
      const date = new Date(formDate);
      const formattedDate = datepipe.transform(date, 'MM/dd/yyyy');
      return formattedDate;
    }
  }
}
