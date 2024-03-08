import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { DatePipe, formatDate } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

/* GSRS Core Imports */
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '../../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ControlledVocabularyService } from '../../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { GeneralService } from '../../../service/general.service';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import * as defiant from '@gsrs-core/../../../node_modules/defiant.js/dist/defiant.min.js';
import { StructureImageModalComponent } from '@gsrs-core/structure';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';
import { JsonDialogFdaComponent } from '../../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../../service/invitro-pharmacology.service'
import { InvitroAssayInformation, ValidationMessage } from '../../model/invitro-pharmacology.model';
import { anyExistsFilter } from '@gsrs-core/substance-details';

@Component({
  selector: 'app-invitro-pharmacology-assay-form',
  templateUrl: './invitro-pharmacology-assay-form.component.html',
  styleUrls: ['./invitro-pharmacology-assay-form.component.scss']
})

export class InvitroPharmacologyAssayFormComponent implements OnInit, OnDestroy {

  assay: InvitroAssayInformation;
  id?: number;

  showSubmissionMessages = false;
  submissionMessage: string;
  validationMessages: Array<ValidationMessage> = [];
  validationResult = false;
  message = '';

  copy: string;
  serverError: boolean;
  searchValue: string;
  errorMessage: string;
  subName = 'Substance Name *';

  substanceId = null;

  isDisableData = false;
  username = null;
  title = null;
  submitDateMessage = '';
  statusDateMessage = '';
  substanceName: string;
  substanceNameHintMessage = '';
  panelExpanded = true;

  downloadJsonHref: any;
  jsonFileName: string;

  isAdmin = false;
  isLoading = true;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private titleService: Title,
    private overlayContainerService: OverlayContainer,
    private authService: AuthService,
    private utilsService: UtilsService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private generalService: GeneralService,
    private invitroPharmacologyService: InvitroPharmacologyService
  ) { }


  ngOnInit() {
    this.isAdmin = this.authService.hasRoles('admin');
    this.loadingService.setLoading(true);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.username = this.authService.getUser();
    const routeSubscription = this.activatedRoute
      .params
      .subscribe(params => {
        if (params['id']) {
          const id = params['id'];
          this.title = 'Update In-vitro Pharmacology Assay Only';
          if (id !== this.id) {
            this.id = id;
            this.titleService.setTitle(`Edit In-vitro Pharmacology Assay Only ` + this.id);
            this.getInvitroPharmacologyDetails();
          }
        } else if (this.activatedRoute.snapshot.queryParams['copyId']) {
          this.id = this.activatedRoute.snapshot.queryParams['copyId'];
          if (this.id) {  //copy from existing Product
            this.titleService.setTitle(`Register In-vitro Pharmacology from Copy ` + this.id);
            this.title = 'Register New Invitro-Pharmacology Assay from Copy Assay Id ' + this.id;
            // this.getProductDetails('copy');
          }
        } else if (this.activatedRoute.snapshot.queryParams['action']) {
          let actionParam = this.activatedRoute.snapshot.queryParams['action'];
          if (actionParam && actionParam === 'import' && window.history.state) {
            this.titleService.setTitle(`Register New In-vitro Pharamcology Assay from Import`);
            this.title = 'Register New In-vitro Pharamcology Assay from Import';
            const record = window.history.state.record;
            const response = JSON.parse(record);
            if (response) {
              this.scrub(response);
              this.invitroPharmacologyService.loadAssayOnly(response);
              this.assay = this.invitroPharmacologyService.assay;
              this.loadingService.setLoading(false);
              this.isLoading = false;
            }
          }
        } else { // Register New In-vitro Pharamcology Assay

          this.title = 'Register New In-vitro Pharmacology Assay Only';
          setTimeout(() => {
            this.titleService.setTitle(`Register In-vitro Pharmacology Assay Only`);
            this.invitroPharmacologyService.loadAssayOnly();
            this.assay = this.invitroPharmacologyService.assay;
            this.loadingService.setLoading(false);
            this.isLoading = false;
          });
        } // else Register
      });
    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getInvitroPharmacologyDetails(newType?: string): void {
    if (this.id != null) {
      const id = this.id.toString();
      const getInvitroSubscribe = this.invitroPharmacologyService.getAssayScreening(id).subscribe(response => {
        if (response) {

          // before copying existing impurities, delete the id
          if (newType && newType === 'copy') {
            this.scrub(response);
          }
          this.invitroPharmacologyService.loadAssayOnly(response);
          this.assay = this.invitroPharmacologyService.assay;

        } else {
          this.handleProductRetrivalError();
        }
        this.loadingService.setLoading(false);
        this.isLoading = false;
      }, error => {
        this.loadingService.setLoading(false);
        this.isLoading = false;
        this.handleProductRetrivalError();
      });
      this.subscriptions.push(getInvitroSubscribe);
    }
  }

  validate(): void {
    this.isLoading = true;
    this.serverError = false;
    this.loadingService.setLoading(true);

    this.validateClient();

    // If there is no error on client side, check validation on server side
    if (this.validationMessages.length === 0) {
      this.showSubmissionMessages = false;
      this.invitroPharmacologyService.validateAssay().pipe(take(1)).subscribe(results => {
        this.submissionMessage = null;
        this.validationMessages = results.validationMessages.filter(
          message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
        this.validationResult = results.valid;
        this.showSubmissionMessages = true;
        this.loadingService.setLoading(false);
        this.isLoading = false;
        if (this.validationMessages.length === 0 && results.valid === true) {
          this.submissionMessage = 'In-vitro Pharmacology is Valid. Would you like to submit?';
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
    this.validationMessages = [];
    this.validationResult = true;

    /*
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
    */

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
      message: 'The in-vitro pharmacology record you\'re trying to edit doesn\'t exist.',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/invitro-pharm/register']);
      this.invitroPharmacologyService.loadAssay();
    }, 5000);
  }

  submit(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    // Set service assay
    this.invitroPharmacologyService.assay = this.assay;

    this.invitroPharmacologyService.saveAssay().subscribe(response => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.submissionMessage = 'In-vitro Pharmacology Assay data was saved successfully!';
      this.showSubmissionMessages = true;
      this.validationResult = false;
      setTimeout(() => {
        this.showSubmissionMessages = false;
        this.submissionMessage = '';
        if (response.id) {
          this.invitroPharmacologyService.bypassUpdateCheck();
          const id = response.id;
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/invitro-pharm/assay', id, 'edit']);
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

  /*
  addNewImpuritiesSubstance(event: Event) {
    event.stopPropagation();

    this.invitroPharmacologyService.addNewImpuritiesSubstance();
  }

  addNewImpuritiesTotal() {
    this.invitroPharmacologyService.addNewImpuritiesTotal();
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
  */

  /*
  deleteImpurities(): void {
    this.invitroPharmacologyService.deleteImpurities().subscribe(response => {
      this.invitroPharmacologyService.bypassUpdateCheck();
      this.displayMessageAfterDeleteImpurities();
    }, (err) => {
      console.log(err);
    }
    );
  }
  */

  displayMessageAfterDeleteImpurities() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'This in-vitro pharmacology assay screening record was deleted successfully',
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
      data: this.invitroPharmacologyService.assay
    });

    //   this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  saveJSON(): void {
    // apply the same cleaning to remove deleted objects and return what will be sent to the server on validation / submission
    let json = this.invitroPharmacologyService.assay;
    json = this.cleanObject(json);
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'Invitro_pharm_assay_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
  }

  importJSON(): void {
    let data: any;
    data = {
      title: 'Assay Record Import',
      entity: 'invitro-pharmacology',
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
            this.router.navigateByUrl('/invitro-pharm/assay/register?action=import', { state: { record: response } });
          }
        }, 1000);
      }
      // }
      // }
    });
  }

  cleanObject(object: any): any {
    const oldObj = object;
    if (oldObj) {
      delete oldObj._self;
    }
    return oldObj;
  }

  nameSearch(event: any, fieldName: string): void {

    if (fieldName && fieldName === 'targetName') {
      // Assign to Target Name
      this.assay.targetName = event;
    } else if (fieldName === 'humanHomologTarget') {
      this.assay.humanHomologTarget = event;
    } else if (fieldName === 'ligandSubstrate') {
      this.assay.ligandSubstrate = event;
    }

    const substanceSubscribe = this.generalService.getSubstanceByName(event).subscribe(response => {
      if (response) {
        if (response.content && response.content.length > 0) {
          const substance = response.content[0];
          if (substance) {
            if (substance.approvalID) {
              // Assign to Target Name Approval ID
              if (fieldName && fieldName === 'targetName') {
                this.assay.targetNameApprovalId = substance.approvalID;
              } else if (fieldName === 'humanHomologTarget') {
                this.assay.humanHomologTargetApprovalId = substance.approvalID;
              } else if (fieldName === 'ligandSubstrate') {
                this.assay.ligandSubstrateApprovalId = substance.approvalID;
              }
            }
          }
        }
      }
    });
    this.subscriptions.push(substanceSubscribe);
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

  /*
  updateDateTypeDate(event) {
    const impDate = new Date(event);
    // Adding one day since the Date object is decreasing one day.  moment.utc did not work.
    this.invitroPharmacologyService.dateTypeDate = moment(impDate).add(1, 'days').format('MM/DD/yyyy');
  }
  */
}
