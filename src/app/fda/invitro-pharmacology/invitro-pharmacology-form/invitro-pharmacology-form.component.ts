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
import * as _ from 'lodash';
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
import { SubstanceRelationship, SubstanceSummary, SubstanceRelated } from '@gsrs-core/substance/substance.model';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service';
import {
  InvitroAssayInformation, InvitroAssayScreening, InvitroLaboratory,
  InvitroReference, InvitroSponsor, InvitroSponsorSubmitter, InvitroTestAgent, InvitroControl, ValidationMessage, InvitroAssayResultInformation
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
  firstAssayToSave: InvitroAssayInformation;
  firstAssaySavedResultInfo: InvitroAssayResultInformation;
  assayResultInfo: InvitroAssayResultInformation = {};
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


  testAgentSubstanceUuid = "";
  showMoreLessFields = true;
  screeningDetails = '';

  isSavedSuccessfullyMessage: Array<boolean> = [];
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
  referenceIndex = 0;

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
    setTimeout(() => {
      this.loadingService.setLoading(this.isLoading);

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
              this.invitroPharmacologyService.loadAssay();
              this.assay = this.invitroPharmacologyService.assay;

              this.getInvitroAssayDetails();
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
              }
            }
          }
          // Register New In-vitro Pharamcology Screening Assay
          else {
            this.title = 'Register New In-vitro Pharmacology Screening';
            setTimeout(() => {
              // Create new Result Information Object to store Laboratory, Sponsor, Test Agents, Batch Number, Reference
              this.createResultInfoObject();
              this.titleService.setTitle(`Register In-vitro Pharmacology Screening`);

              this.invitroPharmacologyService.loadAssay();

              // create empty new assay
              this.assay = this.invitroPharmacologyService.assay;

              // Get All Assay Sets
              this.getAllAssaySets();

              this.isLoading = false;
              this.loadingService.setLoading(this.isLoading);

            });
          } // else Register

        });

      this.subscriptions.push(routeSubscription);
    }, 600);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  // EDIT/UPDATE: Get All Assay/Screening records by Result Information Id
  getInvitroAssayDetails(newType?: string): void {
    if (this.id != null) {
      const id = this.id.toString();
      const getInvitroSubscribe = this.invitroPharmacologyService.getAssaysByResultInfoId(id).subscribe(response => {
        if (response) {

          this.existingAssaysByAssaySetList = response;

          // Loop through Assays and find result information id where same as url id
          this.existingAssaysByAssaySetList.forEach(assay => {
            if (assay) {
              assay.invitroAssayScreenings.forEach((screening, indexScreeing) => {
                if (screening) {
                  if (screening.invitroAssayResultInformation) {

                    // if Url Id is same as Result Information Id, use this screening records in the form
                    if (screening.invitroAssayResultInformation.id == this.id) {

                      this.selectedAssaySet = screening.assaySet;

                      if (screening.invitroAssayResult) {

                        // assign _.show to true for this screening to show in the form
                        screening._show = true;

                        //Copy Result Information
                        this.createResultInfoObject();
                      }

                      this.assayResultInfo = screening.invitroAssayResultInformation;

                      /*
                      this.assayResultInfo.batchNumber = screening.invitroAssayResultInformation.batchNumber;


                      if (this.assayResultInfo.invitroReferences == null) {
                        this.assayResultInfo.invitroReferences = [];
                      }

                      if (screening.invitroAssayResultInformation.invitroReferences.length > 0) {
                        this.assayResultInfo.invitroReferences = screening.invitroAssayResultInformation.invitroReferences;
                      }

                       // screening.invitroAssayResultInformation.invitroReferences.forEach((reference, index) => {
                       //    if (reference) {
                       //     if (reference.primaryReference) {//
                       //       if (reference.primaryReference == true) {
                       //         this.referenceIndex = index;
                       //         this.assayResultInfo.invitroReferences[index] = reference;
                       //       }
                       //     }
                       //    }
                       // });

                      }

                      if (screening.invitroAssayResultInformation.invitroLaboratory) {
                        this.assayResultInfo.invitroLaboratory = screening.invitroAssayResultInformation.invitroLaboratory;
                      }

                      if (screening.invitroAssayResultInformation.invitroSponsor) {
                        this.assayResultInfo.invitroSponsor = screening.invitroAssayResultInformation.invitroSponsor;
                      }

                      if (screening.invitroAssayResultInformation.invitroSponsorReport) {
                        this.assayResultInfo.invitroSponsorReport = screening.invitroAssayResultInformation.invitroSponsorReport;
                      }
                       */
                      if (screening.invitroAssayResultInformation.invitroTestAgent) {
                        //   this.assayResultInfo.invitroTestAgent = screening.invitroAssayResultInformation.invitroTestAgent;
                        this.testAgentSubstanceUuid = screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid;
                      }


                    } // if invitroAssayResultInformation.id == this.id

                  } // if invitroAssayResultInformation exists
                } // if screening
              });
            }
          });

          // before copying existing invitro pharamcology, delete the id
          // if (newType && newType === 'copy') {
          //   this.scrub(response);
          // }

          // this.invitroPharmacologyService.loadAssay(response);
          // this.assay = this.invitroPharmacologyService.assay;

          // } else {

          this.isLoading = false;
          this.loadingService.setLoading(this.isLoading);
        }

      }, error => {
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
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
            invitroControls: []
          };

          // Set to show on the UI
          newInvitroAssayScreening._show = true;

          newInvitroAssayScreening.assaySet = this.selectedAssaySet;

          // Push new screening record in existing Assay
          assay.invitroAssayScreenings.push(newInvitroAssayScreening);

          // Delete Assay Set Object
          //  delete assay.invitroAssaySets;

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

    this.validateClient();

    // If there is no error on client side, check validation on server side
    if (this.validationMessages.length === 0) {
      this.showSubmissionMessages = false;

      // Validate Assay
      // this.invitroPharmacologyService.validateAssay().pipe(take(1)).subscribe(results => {
      this.submissionMessage = null;
      //  this.validationMessages = results.validationMessages.filter(
      //      message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
      //    this.validationResult = results.valid;
      this.showSubmissionMessages = true;
      this.loadingService.setLoading(false);
      this.isLoading = false;

      if (this.validationMessages.length === 0) { //&& results.valid === true) {
        this.submissionMessage = 'Invitro Pharmacology Assay Screening is Valid. Would you like to submit?';
      }
      //   }, error => {
      ////     this.addServerError(error);
      //     this.loadingService.setLoading(false);
      //     this.isLoading = false;
      //  });
    }  // if validationMessages.length === 0

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

    //this.copyResultInfoForSaving();

    // Validate References
    if ((this.assayResultInfo.invitroReferences == null) || (this.assayResultInfo.invitroReferences.length == 0)) {
      this.setValidationMessage('Reference Source Type is required');
    }

    // Validate Reference Source Type is required
    this.assayResultInfo.invitroReferences.forEach(reference => {
      if (reference) {
        if ((reference.sourceType == null) || (reference.sourceType != null && reference.sourceType.length < 1)) {
          this.setValidationMessage('Reference Source Type is required');
        }

        if ((reference.sourceCitation == null) || (reference.sourceCitation != null && reference.sourceCitation.length < 1)) {
          this.setValidationMessage('Reference Source/Citation is required');
        }
      }
    });

    // Validate Laboratory Name is required
    if ((this.assayResultInfo.invitroLaboratory.laboratoryName == null) || (this.assayResultInfo.invitroLaboratory.laboratoryName != null && this.assayResultInfo.invitroLaboratory.laboratoryName.length < 1)) {
      this.setValidationMessage('Laboratory Name is required');
    }

    // Validate Sponsor Contact Name is required
    if ((this.assayResultInfo.invitroSponsor.sponsorContactName == null) || (this.assayResultInfo.invitroSponsor.sponsorContactName != null && this.assayResultInfo.invitroSponsor.sponsorContactName.length < 1)) {
      this.setValidationMessage('Sponsor Contact Name is required');
    }

    // Validate Sponsor Report Submitters list
    if (this.assayResultInfo.invitroSponsorReport) {
      if ((this.assayResultInfo.invitroSponsorReport.invitroSponsorSubmitters == null) || (this.assayResultInfo.invitroSponsorReport.invitroSponsorSubmitters.length == 0)) {
        this.setValidationMessage('Sponsor Report Submitter Name is required');
      }

      // Validate Sponsor Report Submitter Name is required
      this.assayResultInfo.invitroSponsorReport.invitroSponsorSubmitters.forEach((submitter, index) => {
        if (submitter) {
          if ((submitter.sponsorReportSubmitterName == null) || (submitter.sponsorReportSubmitterName != null && submitter.sponsorReportSubmitterName.length < 1)) {
            this.setValidationMessage('Sponsor Report Submitter Name (' + (index + 1) + ') is required');
          }
        }
      });

      // Validate Report Number is required
      if ((this.assayResultInfo.invitroSponsorReport.reportNumber == null) || (this.assayResultInfo.invitroSponsorReport.reportNumber != null && this.assayResultInfo.invitroSponsorReport.reportNumber.length < 1)) {
        this.setValidationMessage('Report Number is required');
      }

    } else {
      this.setValidationMessage('Report Number is required');
      this.setValidationMessage('Sponsor Report Submitter Name is required');
    }

    // Validate Test Agent is required
    if ((this.assayResultInfo.invitroTestAgent.testAgent == null) || (this.assayResultInfo.invitroTestAgent.testAgent != null && this.assayResultInfo.invitroTestAgent.testAgent.length < 1)) {
      this.setValidationMessage('Test Agent is required');
    }

    // Validate Batch Number is required
    if ((this.assayResultInfo.batchNumber == null) || (this.assayResultInfo.batchNumber != null && this.assayResultInfo.batchNumber.length < 1)) {
      this.setValidationMessage('Batch Number is required');
    }

    // Validate Batch Number is required
    if (this.existingAssaysByAssaySetList.length == 0) {
      this.setValidationMessage('Result is required');
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

  private handleRecordRetrivalError() {
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

  createResultInfoObject() {
    this.assayResultInfo.invitroReferences = [{ primaryReference: true }];
    this.assayResultInfo.invitroLaboratory = {};
    this.assayResultInfo.invitroSponsor = {};
    this.assayResultInfo.invitroSponsorReport = { invitroSponsorSubmitters: [{}] };
    this.assayResultInfo.invitroTestAgent = {};
  }

  copyResultInfoForSaving() {
    // LOOP: assay list
    this.existingAssaysByAssaySetList.forEach((assay, indexAssay) => {

      // LOOP: screenings list
      assay.invitroAssayScreenings.forEach((screening, indexScreening) => {
        // if Registering NEW RECORD, copy this Result Reference, Lab, Sponsor, Test Agent Info
        //  if (!this.id) {
        if (screening._show == true) {
          screening.invitroAssayResultInformation = this.assayResultInfo;
        }
        //  }
      });
    });
  }

  createFirstAssayToSave() {
    // Using this assay list in the form
    if (this.existingAssaysByAssaySetList.length > 0) {

      // Get the first Assay from the list
      this.firstAssayToSave = this.existingAssaysByAssaySetList[0];

      // copy the Result Information on the last screening or where _show == true
      // call copy, THIS LINE MUST be before deleteing the _show field in the next code
      this.firstAssayToSave.invitroAssayScreenings.forEach(screening => {
        if (screening) {
          if (screening._show == true) {
            screening.invitroAssayResultInformation = this.assayResultInfo;
          }
        }
      });

      // delete _show field before saving
      this.firstAssayToSave.invitroAssayScreenings.forEach(screening => {
        if (screening) {
          if (screening._show) {
            delete screening._show;
          }
        }
      });

      // Assign assay to Servive assay
      this.invitroPharmacologyService.assay = this.firstAssayToSave;
    }
  }

  saveFirstNewAssay() {
    this.isSavedSuccessfullyMessage = [];
    if (this.id) {
      this.saveRemainingAssays();
    } else {

      // Registering NEW Screening, Saving the FIRST Assay
      this.loadingService.setLoading(true);

      // Create First Assay To Save
      if (this.firstAssayToSave == null) {
        this.createFirstAssayToSave();
      }

      // Create Summary Object to copy Result data
      this.createNewSummary();

      const saveFirstAssaySubscribe = this.invitroPharmacologyService.saveAssay().subscribe(response => {
        if (response) {
          if (response.id) {
            if (response.invitroAssayScreenings.length > 0) {

              // Store in the list if this record was stored into the database successfully or not
              this.isSavedSuccessfullyMessage.push(true);

              // Get the last screening from the returned/saved Assay
              let screening = response.invitroAssayScreenings[response.invitroAssayScreenings.length - 1];

              // Get the saved result information from the database
              // set invitroAssayResultInformation to local variable
              if (screening.invitroAssayResultInformation) {
                this.firstAssaySavedResultInfo = screening.invitroAssayResultInformation;

                // if ** ONLY ONE ** record exists, go to edit page, otherwise save rest of the assays
                if (this.existingAssaysByAssaySetList.length == 1) {

                  setTimeout(() => {
                    // // this.showSubmissionMessages = false;
                    //  this.submissionMessage = '';
                    this.loadingService.setLoading(false);

                    this.validationMessages = null;
                    this.submissionMessage = 'In-vitro Pharmacology Assay Screening data was saved successfully!';
                    this.showSubmissionMessages = true;
                    this.validationResult = false;

                    this.invitroPharmacologyService.bypassUpdateCheck();
                    const id = response.id;
                    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                    this.router.onSameUrlNavigation = 'reload';
                    this.router.navigate(['/invitro-pharm/', this.firstAssaySavedResultInfo.id, 'edit']);

                  }, 4000);
                } else {

                  // remove the first screening, save the remaining screeing into the database
                  this.existingAssaysByAssaySetList.splice(0, 1);

                  // Save remaining assays
                  this.saveRemainingAssays();
                }

              } // if invitroAssayResultInformation exists

            } // if responseAssay.invitroAssayScreenings.length > 0
          } // if response.id  // if saved successfully
        } // if response is back
      }); // save one Assay record first
      this.subscriptions.push(saveFirstAssaySubscribe);

      this.loadingService.setLoading(false);
    }
  }

  saveRemainingAssays() {

    console.log("REMAING ASSAYS LENGTH" + this.existingAssaysByAssaySetList.length);

    // Remove extra fields before saving
    this.scrubExtraFields();

    // Copy the screening to new variable
    let remainingAssays = _.cloneDeep(this.existingAssaysByAssaySetList);

    console.log("REMAING ASSAYS COPY LENGTH" + remainingAssays.length);

    remainingAssays.forEach(assay => {
      if (assay) {

        assay.invitroAssayScreenings.forEach(screening => {
        });

        assay.invitroAssayScreenings[assay.invitroAssayScreenings.length - 1].invitroAssayResultInformation = this.firstAssaySavedResultInfo;

        // Assign the assay to service assay
        this.invitroPharmacologyService.assay = assay;

        console.log("SAVING NOW " + JSON.stringify(remainingAssays));

        const saveSubscribe = this.invitroPharmacologyService.saveAssay().subscribe(response => {

          if (response) {
            console.log("SAVED INTO DATABASE SUCCESSFULLY" + response.id);

               // Get the last screening from the returned/saved Assay
            //   let screening = response.invitroAssayScreenings[response.invitroAssayScreenings.length - 1];

               // Get the saved result information from the database
               // set invitroAssayResultInformation to local variable
            //   if (screening.invitroAssayResultInformation) {
            //     this.firstAssaySavedResultInfo = screening.invitroAssayResultInformation;


            // Store in the list if this record was stored into the database successfully or not
            this.isSavedSuccessfullyMessage.push(true);

            setTimeout(() => {
              // // this.showSubmissionMessages = false;
              //  this.submissionMessage = '';
              if (response.id) {

                console.log("SUCCESS MESSAGE REMAINING" + JSON.stringify(this.isSavedSuccessfullyMessage));

                this.loadingService.setLoading(false);

                this.validationMessages = null;
                this.submissionMessage = 'In-vitro Pharmacology Assay Screening data was saved successfully!';
                this.showSubmissionMessages = true;
                this.validationResult = false;

                this.invitroPharmacologyService.bypassUpdateCheck();
                const id = response.id;
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['/invitro-pharm/', this.firstAssaySavedResultInfo.id, 'edit']);
              }
            }, 4000);
          } // if response remaining assays

        });
        this.subscriptions.push(saveSubscribe);


        /*
        screening.invitroAssayResultInformation = {};
        screening.invitroAssayResultInformation.id = savedResultInfo.id;
        //  screening.invitroAssayResultInformation.internalVersion = savedResultInfo.internalVersion;
        */



      } // if assay
    });
  }

  submit(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    // Set service assay
    //this.invitroPharmacologyService.assay = this.assay;
    //this.invitroPharmacologyService.saveMultipleAssays().subscribe(response => {

    // Copy this when registering
    // call copy, THIS LINE MUST be before this.scrubExtraFields() call
    // if (!this.id) {
    this.copyResultInfoForSaving();
    // }

    // Remove extra fields before saving
    this.scrubExtraFields();




    /*
    this.invitroPharmacologyService.saveBulkAssays(this.existingAssaysByAssaySetList).subscribe(response => {

      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.submissionMessage = 'In-vitro Pharmacology Assay Screening data was saved successfully!';
      this.showSubmissionMessages = true;
      this.validationResult = false;
      setTimeout(() => {
        this.showSubmissionMessages = false;
        this.submissionMessage = '';

        let id = null;
        if (response) {
          if (response[0].invitroAssayScreenings.length > 0) {
            let indexScreeing = response[0].invitroAssayScreenings.length - 1;

            if (response[0].invitroAssayScreenings[indexScreeing].invitroAssayResultInformation) {

              if (response[0].invitroAssayScreenings[indexScreeing].invitroAssayResultInformation.id) {

                id = response[0].invitroAssayScreenings[indexScreeing].invitroAssayResultInformation.id;
                if (id) {
                  // Saved Successfully, reload this update page
                  this.invitroPharmacologyService.bypassUpdateCheck();
                  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                  this.router.onSameUrlNavigation = 'reload';
                  this.router.navigate(['/invitro-pharm/', id, 'edit']);
                }
              }
            }
          }
        } // response
      }, 4000);
    }  */
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
    // );
  }

  showJSON(): void {
    // call copy
    if (!this.id) {
      this.copyResultInfoForSaving();
    }

    let json = this.existingAssaysByAssaySetList;
    //let json = this.assayResultInfo;
    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: json
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

  createNewSummary() {
    // Loop through each Assay
    this.existingAssaysByAssaySetList.forEach(assay => {

      // Get the last screening index
      let lastScreeningIndex = assay.invitroAssayScreenings.length - 1;

      // if Summary object is null, create one
      if (assay.invitroAssayScreenings[lastScreeningIndex].invitroSummary == null) {
        assay.invitroAssayScreenings[lastScreeningIndex].invitroSummary = {};
      }

      assay.invitroAssayScreenings[lastScreeningIndex].invitroSummary.targetName = assay.targetName;
      assay.invitroAssayScreenings[lastScreeningIndex].invitroSummary.resultType = 'IC50';
      assay.invitroAssayScreenings[lastScreeningIndex].invitroSummary.resultValueUnits =
        assay.invitroAssayScreenings[lastScreeningIndex].invitroAssayResult.resultValueUnits;

      // Calculate Result Value and store in Summary Low, Average, and High fields
      // if resultValue in invitroAssayResult is
      // less than 30 percent -   - 10 into the low,  Summary
      // between 30 and 60        - 10 in the Average Summary
      // > 60                     - 10 in the high    Summary

      if (assay.invitroAssayScreenings[lastScreeningIndex].invitroAssayResult.resultValue < 30) {
        assay.invitroAssayScreenings[lastScreeningIndex].invitroSummary.resultValueLow = 10;
      } else if ((assay.invitroAssayScreenings[lastScreeningIndex].invitroAssayResult.resultValue >= 30)
        && (assay.invitroAssayScreenings[lastScreeningIndex].invitroAssayResult.resultValue <= 60)) {
        assay.invitroAssayScreenings[lastScreeningIndex].invitroSummary.resultValueAverage = 10;
      } else if (assay.invitroAssayScreenings[lastScreeningIndex].invitroAssayResult.resultValue > 60) {
        assay.invitroAssayScreenings[lastScreeningIndex].invitroSummary.resultValueHigh = 10;
      }

      assay.invitroAssayScreenings[lastScreeningIndex].invitroSummary.isFromResult = true;

      console.log("AAAAAAAAAAAAAAAAA " + JSON.stringify(assay.invitroAssayScreenings[lastScreeningIndex].invitroSummary));
    });
  }

  addNewControl(indexAssay: number, indexScreening: number) {
    const newControl: InvitroControl = {}
    let screeningLength = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings.length;
    this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[indexScreening].invitroControls.push(newControl);
  }

  testAgentUpdated(substance: SubstanceSummary): void {
    if (substance != null) {
      this.assayResultInfo.invitroTestAgent.testAgentSubstanceUuid = substance.uuid;
      this.assayResultInfo.invitroTestAgent.testAgent = substance._name;
    }
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
      //  this.assay.invitroAssayScreenings[0].invitroReference.referenceSourceType = reference[0];
      //  this.assay.invitroAssayScreenings[0].invitroReference.referenceSource = reference[1];

      this.referenceMessage = "";
    }
  }

  selectionChangeExistingSponsor(event) {
    if (event) {
      //   this.assay.invitroAssayScreenings[0].invitroReference.invitroSponsor.sponsorContactName = event;
    }
  }

  selectionChangeExistingSubmitter(event) {
    if (event) {
      //  this.assay.invitroAssayScreenings[0].invitroReference.invitroSponsor.sponsorContactName = event;
    }
  }

  selectionChangeExistingLaboratory(event) {
    if (event) {
      //   this.assay.invitroAssayScreenings[0].invitroLaboratory.laboratoryName = event;
    }
  }

  selectionChangeExistingTestAgent(event, screeningIndex) {
    if (event) {
      //   this.assay.invitroAssayScreenings[0].invitroTestAgent.testAgent = event;
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

  toggleShowMoreLessFields() {
    this.showMoreLessFields = !this.showMoreLessFields;
  }

  addNewSponsorReportSubmitter() {
    if (this.assayResultInfo.invitroSponsorReport.invitroSponsorSubmitters == null) {
      this.assayResultInfo.invitroSponsorReport.invitroSponsorSubmitters = [];
    }
    const newSubmitter: InvitroSponsorSubmitter = {};
    if (this.assayResultInfo.invitroSponsorReport) {
      if (this.assayResultInfo.invitroSponsorReport.invitroSponsorSubmitters) {
        this.assayResultInfo.invitroSponsorReport.invitroSponsorSubmitters.push(newSubmitter);
      }
    }
  }

  confirmClearAll(indexAssay: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to clear all five fields in all the rows?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.clearAll(indexAssay);
      }
    });
  }

  clearAll(indexAssay: number) {
    let indexFirstAssayScreening = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings.length - 1;

    this.existingAssaysByAssaySetList.forEach((assay, index) => {
      let indexScreening = assay.invitroAssayScreenings.length - 1;

      //Copy Result data from first row to all the other rows. Only copy if the field is empty
      if (assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testAgentConcentration) {
        assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testAgentConcentration = null;
      }

      if (assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testAgentConcentrationUnits) {
        assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testAgentConcentrationUnits = '';
      }

      if (assay.invitroAssayScreenings[indexScreening].invitroAssayResult.resultValue) {
        assay.invitroAssayScreenings[indexScreening].invitroAssayResult.resultValue = null;
      }

      if (assay.invitroAssayScreenings[indexScreening].invitroAssayResult.resultValueUnits) {
        assay.invitroAssayScreenings[indexScreening].invitroAssayResult.resultValueUnits = '';
      }

      if (assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testDate) {
        assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testDate = '';
      }
    });
  }

  applyToAllRow(indexAssay: number): void {
    // if (checkBoxValue === true) {
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

        if (!assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testDate) {
          assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testDate = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[indexFirstAssayScreening].invitroAssayResult.testDate;
        }
      }
    });
    // }
  }

  copyAssaySummaryRow(indexAssay: number) {
    let indexAssayScreening = this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings.length - 1;

    // Remove extra fields before saving
    // this.scrubExtraFields();

    // Copy the assay to new variable
    let copyAssay = _.cloneDeep(this.existingAssaysByAssaySetList[indexAssay]);
    this.existingAssaysByAssaySetList.splice(indexAssay + 1, 0, copyAssay);
  }

  setPlasmaProteinCheckBox(checkBoxValue: any, screeningIndex: number): void {
    this.assay.invitroAssayScreenings[screeningIndex].invitroAssayResult.plasmaProteinAdded = checkBoxValue;
  }

  confirmDeleteSubmitter(indexSubmitter: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Sponsor Report Submitter ' + (indexSubmitter + 1) + ' ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteSubmitter(indexSubmitter);
      }
    });
  }

  deleteSubmitter(indexSubmitter: number) {
    this.assayResultInfo.invitroSponsorReport.invitroSponsorSubmitters.splice(indexSubmitter, 1);
  }

  confirmDeleteResult(indexAssay: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Result ' + (indexAssay + 1) + ' ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteResult(indexAssay);
      }
    });
  }

  deleteResult(indexAssay: number) {
    this.existingAssaysByAssaySetList.splice(indexAssay, 1);
  }

  confirmDeleteControl(indexAssay: number, indexScreening: number, indexControl: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Control' + (indexControl + 1) + ' ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteControl(indexAssay, indexScreening, indexControl);
      }
    });
  }

  deleteControl(indexAssay: number, indexScreening: number, indexControl: number) {
    this.existingAssaysByAssaySetList[indexAssay].invitroAssayScreenings[indexScreening].invitroControls.splice(indexControl, 1);
  }

  scrubExtraFields() {
    this.existingAssaysByAssaySetList.forEach(assay => {
      if (assay) {
        assay.invitroAssayScreenings.forEach(screening => {
          if (screening) {
            if (screening._show) {
              delete screening._show;
            }
          }
        });
      }
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

    const showHolders = defiant.json.search(old, '//*[_show]');
    for (let i = 0; i < showHolders.length; i++) {
      delete showHolders[i]._show;
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
