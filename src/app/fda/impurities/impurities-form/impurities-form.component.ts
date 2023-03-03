import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Impurities, ImpuritiesDetails, ImpuritiesUnspecified, SubRelationship, ValidationMessage } from '../model/impurities.model';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ImpuritiesService } from '../service/impurities.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { LoadingService } from '@gsrs-core/loading';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { ControlledVocabularyService } from '../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { take, map } from 'rxjs/operators';
import { DatePipe, formatDate } from '@angular/common';
import { Title } from '@angular/platform-browser';
import * as defiant from '@gsrs-core/../../../node_modules/defiant.js/dist/defiant.min.js';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FormBuilder } from '@angular/forms';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';
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
  panelExpanded = true;
  downloadJsonHref: any;
  jsonFileName: string;

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
    private fb: FormBuilder,
    private titleService: Title,
    private sanitizer: DomSanitizer) { }

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
            this.titleService.setTitle(`Update Impurities`);
            this.getImpurities();
          }
        } else { //Copy Impurities to register form
          this.title = 'Register Impurities';
          const action = this.activatedRoute.snapshot.queryParams['action'] || null;
          this.id = this.activatedRoute.snapshot.queryParams['copy'] || null;
          if (action && action === 'import' && window.history.state) {
            this.gaService.sendPageView(`Impurities Import`);
            const record = window.history.state.record;
            // this.imported = true;
            // this.getDetailsFromImport(record.record);
            // if ((record) && this.jsonValid(record)) {
            const response = JSON.parse(record);
            if (response) {
              this.scrub(response);

              this.impuritiesService.loadImpurities(response);
              this.impurities = this.impuritiesService.impurities;

              this.loadingService.setLoading(false);
              this.isLoading = false;
            }
            //this.substanceFormService.loadSubstance(this.substanceClass, responseImport).pipe(take(1)).subscribe(() => {
            // this.substanceSsg4mService.loadSubstance(this.subClass).pipe(take(1)).subscribe(() => {
            // this.setFormSections(formSections[this.substanceClass]);
            // });
            //  }
            //  }
          } else if (this.id) { //copy
            this.getImpurities('copy');
            this.gaService.sendPageView(`Impurities Register`);
          } else {
            setTimeout(() => {
              this.gaService.sendPageView(`Impurities Register`);
              this.titleService.setTitle(`Register Impurities`);
              this.impuritiesService.loadImpurities();
              this.impurities = this.impuritiesService.impurities;
              this.loadingService.setLoading(false);
              this.isLoading = false;
            });
          }
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

          // before copying existing impurities, delete the id
          if (newType && newType === 'copy') {
            this.scrub(response);
          }
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
    this.isLoading = true;
    this.serverError = false;
    this.loadingService.setLoading(true);

    // Check validation on Client side.
    this.validateClient();

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

  setValidationMessage(message: string) {
    const validate: ValidationMessage = {};
    validate.message = message;
    validate.messageType = 'ERROR';
    this.validationMessages.push(validate);
    this.validationResult = false;
  }

  // Validate data in client side first
  validateClient(): void {
    this.validationMessages = [];
    this.validationResult = true;

    // Validate Subsance
    if (this.impurities.impuritiesSubstanceList.length === 0) {
      this.setValidationMessage('Substance Name is required');
    }

    // Validate Substance Name
    if (this.impurities != null) {
      this.impurities.impuritiesSubstanceList.forEach((elementSub, index) => {
        if (elementSub != null) {
          if (elementSub.substanceUuid == null) {
            this.setValidationMessage('Substance Name (' + (index + 1) + ') is required');
          }
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
          this.impuritiesService.bypassUpdateCheck();
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

  addNewImpuritiesSubstance(event: Event) {
    event.stopPropagation();

    this.impuritiesService.addNewImpuritiesSubstance();
  }

  addNewImpuritiesTotal() {
    this.impuritiesService.addNewImpuritiesTotal();
  }

  confirmDeleteImpurities() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this Impurities?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpurities();
      }
    });
  }

  deleteImpurities(): void {
    this.impuritiesService.deleteImpurities().subscribe(response => {
      this.impuritiesService.bypassUpdateCheck();
      this.displayMessageAfterDeleteImpurities();
    }, (err) => {
      console.log(err);
    }
    );
  }

  displayMessageAfterDeleteImpurities() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'This impurities record was deleted successfully',
        type: 'home'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/home']);
    });
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

  saveJSON(): void {
    // apply the same cleaning to remove deleted objects and return what will be sent to the server on validation / submission
    let json = this.impurities;
    // this.json = this.cleanObject(substanceCopy);
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'impurities_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
  }

  importJSON(): void {
    let data: any;
    data = {
      title: 'Impurities Record Import',
      entity: 'Impurities',
    };
    const dialogRef = this.dialog.open(SubstanceEditImportDialogComponent, {
      width: '650px',
      autoFocus: false,
      data: data
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
      if (response) {
        this.loadingService.setLoading(true);
        this.overlayContainer.style.zIndex = null;

        // attempting to reload a substance without a router refresh has proven to cause issues with the relationship dropdowns
        // There are probably other components affected. There is an issue with subscriptions likely due to some OnInit not firing

        /* const read = JSON.parse(response);
         if (this.id && read.uuid && this.id === read.uuid) {
           this.substanceFormService.importSubstance(read, 'update');
           this.submissionMessage = null;
           this.validationMessages = [];
           this.showSubmissionMessages = false;
           this.loadingService.setLoading(false);
           this.isLoading = false;
         } else {
         if ( read.substanceClass === this.substanceClass) {
           this.imported = true;
           this.substanceFormService.importSubstance(read);
           this.submissionMessage = null;
           this.validationMessages = [];
           this.showSubmissionMessages = false;
           this.loadingService.setLoading(false);
           this.isLoading = false;
         } else {*/
        setTimeout(() => {
          this.router.onSameUrlNavigation = 'reload';
          this.loadingService.setLoading(false);
          if (!this.id) {
            // new record
            this.router.navigateByUrl('/impurities/register?action=import', { state: { record: response } });
          }
        }, 1000);
      }
      // }
      // }
    });
  }

  scrub(oldraw: any): any {
    const old = oldraw;
    const idHolders = defiant.json.search(old, '//*[id]');
    for (let i = 0; i < idHolders.length; i++) {
      if (idHolders[i].id) {
        delete idHolders[i].id;
      }
    }

    const createHolders = defiant.json.search(old, '//*[creationDate]');
    for (let i = 0; i < createHolders.length; i++) {
      delete createHolders[i].creationDate;
    }

    const createdByHolders = defiant.json.search(old, '//*[createdBy]');
    for (let i = 0; i < createdByHolders.length; i++) {
      delete createdByHolders[i].createdBy;
    }

    const modifyHolders = defiant.json.search(old, '//*[lastModifiedDate]');
    for (let i = 0; i < modifyHolders.length; i++) {
      delete modifyHolders[i].lastModifiedDate;
    }

    const modifiedByHolders = defiant.json.search(old, '//*[modifiedBy]');
    for (let i = 0; i < modifiedByHolders.length; i++) {
      delete modifiedByHolders[i].modifiedBy;
    }

    const intVersionHolders = defiant.json.search(old, '//*[internalVersion]');
    for (let i = 0; i < intVersionHolders.length; i++) {
      delete intVersionHolders[i].internalVersion;
    }

    delete old['creationDate'];
    delete old['createdBy'];
    delete old['modifiedBy'];
    delete old['lastModifiedDate'];
    delete old['internalVersion'];
    delete old['$$update'];
    delete old['_self'];

    return old;
  }

  updateDateTypeDate(event) {
    const impDate = new Date(event);
    // Adding one day since the Date object is decreasing one day.  moment.utc did not work.
    this.impurities.dateTypeDate = moment(impDate).add(1, 'days').format('MM/DD/yyyy');
  }

}
