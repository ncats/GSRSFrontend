import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
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
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ControlledVocabularyService } from '../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { GeneralService } from '../../service/general.service';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import * as defiant from '@gsrs-core/../../../node_modules/defiant.js/dist/defiant.min.js';
import { StructureImageModalComponent } from '@gsrs-core/structure';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service';
import {
  InvitroAssayInformation, InvitroAssayScreening, InvitroLaboratory,
  InvitroReference, InvitroSponsor, InvitroSponsorSubmitter, InvitroTestAgent, InvitroControl, ValidationMessage
} from '../model/invitro-pharmacology.model';
//import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER } from '@angular/cdk/overlay/overlay-directives';

@Component({
  selector: 'app-invitro-pharmacology-form',
  templateUrl: './invitro-pharmacology-form.component.html',
  styleUrls: ['./invitro-pharmacology-form.component.scss']
})
export class InvitroPharmacologyFormComponent implements OnInit, OnDestroy {

  assay: InvitroAssayInformation;
  assayTemp: InvitroAssayInformation;
  id?: number;

  // Form Control
  existingAssayControl = new FormControl();
  existingAssaySetControl = new FormControl();
  existingReferenceControl = new FormControl();
  existingSponsorControl = new FormControl();
  existingLaboratoryControl = new FormControl();
  existingTestAgentControl = new FormControl();

  // Suggestions/TypeAhead/Dropdown
  //existingAssayList: Array<InvitroAssayInformation> = [];
  existingAssaySetList: Array<any> = [];
  existingAssaysByAssaySetList: Array<InvitroAssayInformation> = [];

  existingReferenceList: Array<InvitroReference> = [];
  existingSponsorList: Array<InvitroSponsor> = [];
  existingSponsorSubmittersList: Array<InvitroSponsorSubmitter> = [];
  existingLaboratoryList: Array<InvitroLaboratory> = [];
  existingTestAgentList: Array<InvitroTestAgent> = [];

  selectedAssaySet = '';

  // Selection
  radioSelectedReference = 'selectedExistingReference';
  radioSelectedSponsor = 'selectedExistingSponsor';
  radioSelectedTestAgent = 'selectedExistingTestAgent';
  radioSelectedLaboratory = 'selectedExistingLaboratory';
  radioSelectedReportSubmitter = 'selectedExistingReportSubmitter';

  assayMessage = '';
  referenceMessage = '';

  showMoreLessFields = true;
  screeningDetails = '';

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

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  isLinear = false;

  constructor(
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private titleService: Title,
    private overlayContainerService: OverlayContainer,
    private authService: AuthService,
    private utilsService: UtilsService,
    private cvService: ControlledVocabularyService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private generalService: GeneralService,
    private invitroPharmacologyService: InvitroPharmacologyService
  ) { }

  ngOnInit() {
    // Control Change: When All existing Assay data is selected, assign assay details
    /*
    this.existingAssayControl.valueChanges.subscribe(valueIndex => {

      this.assay.id = this.existingAssayList[valueIndex].id;
      this.assay.internalVersion = this.existingAssayList[valueIndex].internalVersion;
      this.assay.externalAssayId = this.existingAssayList[valueIndex].externalAssayId;
      this.assay.externalAssaySource = this.existingAssayList[valueIndex].externalAssaySource;
      this.assay.targetName = this.existingAssayList[valueIndex].targetName;

      let screeningDetails = this.existingAssayList[valueIndex].invitroAssayScreenings;
      screeningDetails.forEach(screening => {
        if (screening.invitroTestAgent) {
          if (screening.invitroTestAgent.testAgent) {
            this.screeningDetails = this.screeningDetails + screening.invitroTestAgent.testAgent + "<br>";
          }
        }
      });
    });  */

    // Show Loading Spinner
    this.loadingService.setLoading(true);

    // Get Username and Admin details
    this.isAdmin = this.authService.hasRoles('admin');
    this.username = this.authService.getUser();

    this.overlayContainer = this.overlayContainerService.getContainerElement();

    const routeSubscription = this.activatedRoute
      .params
      .subscribe(params => {
        // Get existing Assay record
        if (params['id']) {
          const id = params['id'];
          this.title = 'Update In-vitro Pharmacology Screening';
          if (id !== this.id) {
            this.id = id;
            this.titleService.setTitle(`Edit In-vitro Pharmacology Screening ` + this.id);
            this.getInvitroPharmacologyDetails();
          }
        }
        // Copy
        else if (this.activatedRoute.snapshot.queryParams['copyId']) {
          this.id = this.activatedRoute.snapshot.queryParams['copyId'];
          if (this.id) {  //copy from existing Product
            this.titleService.setTitle(`Register In-vitro Pharmacology from Copy ` + this.id);
            this.title = 'Register New Invitro-Pharmacology Assay from Copy Assay Id ' + this.id;
          }
        }
        // Import
        else if (this.activatedRoute.snapshot.queryParams['action']) {
          let actionParam = this.activatedRoute.snapshot.queryParams['action'];
          if (actionParam && actionParam === 'import' && window.history.state) {
            this.titleService.setTitle(`Register New In-vitro Pharmacology from Import`);
            this.title = 'Register New In-vitro Pharmacology from Import';
            const record = window.history.state.record;
            const response = JSON.parse(record);
            if (response) {
              this.scrub(response);
              this.loadingService.setLoading(false);
              this.isLoading = false;
            } else {
              this.loadingService.setLoading(false);
              this.isLoading = false;
            }
          }
        }
        // Register New In-vitro Pharamcology Screening Assay
        else {
          this.title = 'Register New In-vitro Pharmacology Screening';
          setTimeout(() => {
            this.titleService.setTitle(`Register In-vitro Pharmacology Screening`);
            this.invitroPharmacologyService.loadScreening();
            this.assay = this.invitroPharmacologyService.assay;

            this.loadingService.setLoading(false);
            this.isLoading = false;
          });
        } // else Register

      });

    this.subscriptions.push(routeSubscription);

    // Get All Existing Assays suggestions/TypeAhead
    //this.getAllExistingAssays();

    // Get All Assay Sets
    this.getAllAssaySets();

    // Get All Existing References for Dropdown
    this.getExistingReferences();

    // Get All Existing Sponsors for Dropdown
    this.getExistingSponsors();

    // Get All Existing Sponsors Submitters for Dropdown
    this.getAllSponsorSubmitters();

    // Get All Existing Laboratories for Dropdown
    this.getExistingLaboratories();

    // Get All Existing Test Agents in Suggestions/TypeAhead
    this.loadTestAgentsTypeAhead();
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

          // before copying existing invitro pharamcology, delete the id
          if (newType && newType === 'copy') {
            this.scrub(response);
          }
          this.invitroPharmacologyService.loadAssay(response);
          this.assay = this.invitroPharmacologyService.assay;

        } else {
          this.handleRecordRetrivalError();
        }
        this.loadingService.setLoading(false);
        this.isLoading = false;
      }, error => {
        this.loadingService.setLoading(false);
        this.isLoading = false;
        this.handleRecordRetrivalError();
      });
      this.subscriptions.push(getInvitroSubscribe);
    }
  }

  /*
  getAllExistingAssays() {
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllAssays().subscribe(response => {
      if (response) {
        this.existingAssayList = response;
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
  */

  getAllAssaySets() {
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllAssaySets().subscribe(response => {
      if (response) {
        this.existingAssaySetList = response;
      } else {
        this.handleRecordRetrivalError();
      }

      //  this.loadingService.setLoading(false);
      //  this.isLoading = false;
    }, error => {
      // this.loadingService.setLoading(false);
      // this.isLoading = false;
      this.loadingService.setLoading(false);
      this.handleRecordRetrivalError();
    });
    this.subscriptions.push(getInvitroSubscribe);
  }

  getAllAssysByAssaySet(assaySet: string) {
    this.assayMessage = "Loading Assays ...";
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllAssysByAssaySet(assaySet).subscribe(response => {
      if (response) {
        this.existingAssaysByAssaySetList = response;

        // LOOP: assay list
        this.existingAssaysByAssaySetList.forEach((assay, indexAssay) => {
          if (assay.invitroAssayScreenings == null) {
            assay.invitroAssayScreenings = [];
          }

          // add new screening
          const newInvitroAssayScreening: InvitroAssayScreening =
          {
           // invitroReference: { invitroSponsor: {} },
          //  invitroSponsorReport: { invitroSponsorSubmitters: [{}] },
          //  invitroLaboratory: {},
         //   invitroTestAgent: {},
            invitroAssayResult: {},
          //  invitroControls: [{}]
          };

          // Push new screening record in existing Assay
          assay.invitroAssayScreenings.push(newInvitroAssayScreening);
        }); // LOOP: assay

      } else {
        this.handleRecordRetrivalError();
      }
      // this.loadingService.setLoading(false);
      //this.isLoading = false;
      this.assayMessage = "";
    }, error => {
      // this.loadingService.setLoading(false);
      // this.isLoading = false;
      // this.assayMessage = "";
      this.handleRecordRetrivalError();

    });
    this.subscriptions.push(getInvitroSubscribe);
  }

  getExistingReferences() {
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllReferences().subscribe(response => {
      if (response) {
        this.existingReferenceList = response;
      } else {
        this.handleRecordRetrivalError();
      }
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.handleRecordRetrivalError();
    });
    this.subscriptions.push(getInvitroSubscribe);
  }

  getExistingSponsors() {
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllSponsors().subscribe(response => {
      if (response) {
        this.existingSponsorList = response;
      } else {
        this.handleRecordRetrivalError();
      }
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.handleRecordRetrivalError();
    });
    this.subscriptions.push(getInvitroSubscribe);
  }

  getAllSponsorSubmitters() {
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllSponsorSubmitters().subscribe(response => {
      if (response) {
        this.existingSponsorSubmittersList = response;
      } else {
        this.handleRecordRetrivalError();
      }
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.handleRecordRetrivalError();
    });
    this.subscriptions.push(getInvitroSubscribe);
  }

  getExistingLaboratories() {
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllLaboratories().subscribe(response => {
      if (response) {
        this.existingLaboratoryList = response;
      } else {
        this.handleRecordRetrivalError();
      }
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.handleRecordRetrivalError();
    });
    this.subscriptions.push(getInvitroSubscribe);
  }

  loadTestAgentsTypeAhead() {
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllTestAgents().subscribe(response => {
      if (response) {
        this.existingTestAgentList = response;
      } else {
        this.handleRecordRetrivalError();
      }
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.handleRecordRetrivalError();
    });
    this.subscriptions.push(getInvitroSubscribe);
  }

  validate(): void {
    this.isLoading = true;
    this.serverError = false;
    this.loadingService.setLoading(true);

    // Check validation on Client side.
    this.validateClient();

    // If there is no error on client side, check validation on server side
    if (this.validationMessages.length === 0) {
      this.submissionMessage = null;
      //   this.validationMessages = results.validationMessages.filter(
      //      message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
      //   this.validationResult = results.valid;

      this.validationResult = true;
      this.showSubmissionMessages = true;
      this.loadingService.setLoading(false);
      this.isLoading = false;


      if (this.validationMessages.length === 0 && this.validationResult === true) {
        this.submissionMessage = 'Invitro Pharmacology Assay Screening is Valid. Would you like to submit?';
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

  private handleRecordRetrivalError() {
    const notification: AppNotification = {
      message: 'The in-vitro pharmacology record you\'re trying to edit doesn\'t exist.',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/invitro-pharm/register']);
      this.invitroPharmacologyService.loadScreening();
    }, 5000);
  }

  setData() {

  }

  submit(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    // Set service assay
    //this.invitroPharmacologyService.assay = this.assay;
    //this.invitroPharmacologyService.saveMultipleAssays().subscribe(response => {
      this.invitroPharmacologyService.saveMultipleAssays(this.existingAssaysByAssaySetList).subscribe(response => {

      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.submissionMessage = 'In-vitro Pharmacology Assay Screening data was saved successfully!';
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
          this.router.navigate(['/invitro-pharm', id]);
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

  showJSON(): void {
    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: this.existingAssaysByAssaySetList
      // data: this.invitroPharmacologyService.assay
    });

    //   this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  saveJSON(): void {
    // apply the same cleaning to remove deleted objects and return what will be sent to the server on validation / submission
    let json = this.invitroPharmacologyService.assay;
    // this.json = this.cleanObject(substanceCopy);
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'assay_screening_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
  }

  importJSON(): void {
    let data: any;
    data = {
      title: 'Assay Screening Record Import',
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
            this.router.navigateByUrl('/invitro-pharm/register?action=import', { state: { record: response } });
          }
        }, 1000);
      }
      // }
      // }
    });
  }

  addNewScreening(event: Event) {
    this.invitroPharmacologyService.addNewScreening();
  }

  createNewReference() {
    /*

    if (this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].reference == null) {
     this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].reference = {};
    }

    if (existingRef) {
     this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].reference.id = ref.id;
      this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].reference.internalVersion = ref.internalVersion;
    }
    if (createNewRef) {

    }

      */
  }

  createNewSummary() {
    /*
    if (this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].summary == null) {
      this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].summary = {};
    }
      this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].summary.targetName = assay.targetName;
      this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].summary.averageValue = 10;
      this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].summary.resultType = 'IC50';
    }
    */
  }

  addNewControl(indexAssay: number) {
    const newControl: InvitroControl = {}
    let screeningLength = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings.length;
    this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].invitroControls.push(newControl);
  }

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

  nameSearch(event: any, fieldName?: string, indexAssay?: number, indexCtrl?: number): void {

    if (fieldName && fieldName === 'testAgent') {
      // this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgent = event;
    } else if (fieldName === 'humanHomologTarget') {
      this.assay.humanHomologTarget = event;
    } else if (fieldName === 'ligandSubstrate') {
      this.assay.ligandSubstrate = event;
    } else if (fieldName === 'control') {
      let screeningLength = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings.length;
      this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].invitroControls[indexCtrl].control = event;
    }

    const substanceSubscribe = this.generalService.getSubstanceByName(event).subscribe(response => {
      if (response) {
        if (response.content && response.content.length > 0) {
          const substance = response.content[0];

          // If Substance found
          if (substance) {

            // Assign Substance UUID
            if (fieldName && fieldName === 'testAgent') {
              // this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentSubstanceUuid = substance.uuid;

            }

            // Assign Substance Approval ID
            if (substance.approvalID) {

              if (fieldName && (fieldName === 'testAgent' || fieldName === 'control')) {
                // Assign to Test Agent Approval ID
                //  this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentApprovalId = substance.approvalID;

                // Control Approval ID
                let screeningLength = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings.length;
                this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[screeningLength - 1].invitroControls[indexCtrl].controlApprovalId = substance.approvalID;

              }
            } // if Substance Approval ID exists

            // Assign to Structure Smiles and Formula Weight
            if (substance.structure) {
              if (substance.structure.smiles) {
                //   this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentSmileString = substance.structure.smiles;
              }
              if (substance.structure.formula) {
                //   this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentMolecularFormulaWeight = substance.structure.formula;
              }
            } // if Substance Structure exists

          } // if Substance exists
        } // if response content > 0
      } // if response
    });
    this.subscriptions.push(substanceSubscribe);
  }

  selectionChangeExistingAssaySet(event) {
    if (event) {
      this.getAllAssysByAssaySet(event);
      this.selectedAssaySet = event;
    }
  }

  selectionChangeExistingReference(event) {
    if (event) {
      let reference = (event.split('||'));
      this.assay.invitroAssayScreenings[0].invitroReference.referenceSourceType = reference[0];
      this.assay.invitroAssayScreenings[0].invitroReference.referenceSource = reference[1];

      this.referenceMessage = "";
    }
  }

  selectionChangeExistingSponsor(event) {
    if (event) {
      this.assay.invitroAssayScreenings[0].invitroReference.invitroSponsor.sponsorContactName = event;
    }
  }

  selectionChangeExistingSubmitter(event) {
    if (event) {
      //  this.assay.invitroAssayScreenings[0].invitroReference.invitroSponsor.sponsorContactName = event;
    }
  }

  selectionChangeExistingLaboratory(event) {
    if (event) {
      this.assay.invitroAssayScreenings[0].invitroLaboratory.laboratoryName = event;
    }
  }

  selectionChangeExistingTestAgent(event, screeningIndex) {
    if (event) {
      this.assay.invitroAssayScreenings[0].invitroTestAgent.testAgent = event;
    }
  }

  changeSelectionRadioReference(event) {
    this.radioSelectedReference = event.value;
  }

  changeSelectionRadioSponsor(event) {
    this.radioSelectedSponsor = event.value;

    if (this.radioSelectedSponsor === 'selectedNewSponsor') {
      const sponsor: InvitroSponsor = {};
    }
  }

  changeSelectionRadioReportSubmitters(event) {
    this.radioSelectedReportSubmitter = event.value;
  }

  changeSelectionRadioTestAgent(event) {
    this.radioSelectedTestAgent = event.value;
  }

  changeSelectionRadioLaboratory(event) {
    this.radioSelectedLaboratory = event.value;
  }

  copyAssaySummaryRow() {

  }

  toggleShowMoreLessFields() {
    this.showMoreLessFields = !this.showMoreLessFields;
  }

  applyToAllData(checkBoxValue: any, indexAssay: number): void {
    if (checkBoxValue === true) {
      let indexFirstAssayScreening = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings.length - 1;

      this.existingAssaysByAssaySetList.forEach((assay, index) => {
        if (index != 0) {

          let indexScreening = assay.invitroAssayScreenings.length - 1;

          //Copy Result data from first row to all the other rows. Only copy if the field is empty
          if (!assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testAgentConcentration) {
            assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testAgentConcentration = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[indexFirstAssayScreening].invitroAssayResult.testAgentConcentration;
          }

          if (!assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testAgentConcentrationUnits) {
            assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testAgentConcentrationUnits = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[indexFirstAssayScreening].invitroAssayResult.testAgentConcentrationUnits;
          }

          if (!assay.invitroAssayScreenings[indexScreening].invitroAssayResult.resultValue) {
            assay.invitroAssayScreenings[indexScreening].invitroAssayResult.resultValue = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[indexFirstAssayScreening].invitroAssayResult.resultValue;
          }

          if (!assay.invitroAssayScreenings[indexScreening].invitroAssayResult.resultValueUnits) {
            assay.invitroAssayScreenings[indexScreening].invitroAssayResult.resultValueUnits = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[indexFirstAssayScreening].invitroAssayResult.resultValueUnits;
          }
        }
      });
    }
  }

  setPlasmaProteinCheckBox(checkBoxValue: any, screeningIndex: number): void {
    this.assay.invitroAssayScreenings[screeningIndex].invitroAssayResult.plasmaProteinAdded = checkBoxValue;
  }

  confirmDeleteScreening(screeningIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Screening ' + (screeningIndex + 1) + ' ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteScreening(screeningIndex);
      }
    });
  }

  deleteScreening(screeningIndex: number) {
    this.invitroPharmacologyService.deleteScreening(screeningIndex);
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
