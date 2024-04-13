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
import { SubstanceRelationship, SubstanceSummary, SubstanceRelated, MediatorSubstance } from '@gsrs-core/substance/substance.model';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../../service/invitro-pharmacology.service';
import { InvitroAssayInformation, InvitroAssayScreening, InvitroSummary, InvitroReference, InvitroTestAgent, ValidationMessage } from '../../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-summary-form',
  templateUrl: './invitro-pharmacology-summary-form.component.html',
  styleUrls: ['./invitro-pharmacology-summary-form.component.scss']
})
export class InvitroPharmacologySummaryFormComponent implements OnInit, OnDestroy {

  newTestAgent: InvitroTestAgent = {};   //???? can remove

  // Need this variables
  testAgentSubstanceUuid: string;
  testAgent: string;

  assay: InvitroAssayInformation;   //??? can remove
  selectedAssay: InvitroAssayInformation;

  id?: number;

  // Form Control
  existingAssayControl = new FormControl();
  existingAssaySetControl = new FormControl();
  existingReferenceControl = new FormControl();
  existingTestAgentControl = new FormControl();

  // Suggestions/TypeAhead/Dropdown
  existingAssayList: Array<InvitroAssayInformation> = [];
  assayList: Array<InvitroAssayInformation> = [];
  screeningList: Array<InvitroAssayScreening> = [];
  newAssayList: Array<InvitroAssayInformation> = [];

  existingAssaySetList: Array<any> = [];
  existingReferenceList: Array<InvitroReference> = [];
  existingTestAgentList: Array<InvitroTestAgent> = [];

  selectedAssaySet = '';

  assayMessage = '';
  referenceMessage = '';

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
    // Get Username and Admin details
    this.isAdmin = this.authService.hasRoles('admin');
    this.username = this.authService.getUser();

    this.loadingService.setLoading(true);
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    const routeSubscription = this.activatedRoute
      .params
      .subscribe(params => {
        // Get existing record
        if (params['id']) {
          const id = params['id'];
          this.title = 'Update In-vitro Pharmacology Summary';
          if (id !== this.id) {
            this.id = id;
            this.titleService.setTitle(`Edit In-vitro Pharmacology Summary ` + this.id);
            this.getTestAgentSummariesDetails();
          }
        }
        else if (this.activatedRoute.snapshot.queryParams['copyId']) {
          this.id = this.activatedRoute.snapshot.queryParams['copyId'];
          if (this.id) {  //copy from existing Product
            this.titleService.setTitle(`Register In-vitro Pharmacology from Copy ` + this.id);
            this.title = 'Register New Invitro-Pharmacology Summary from Copy Assay Id ' + this.id;
          }
        }
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
        // Register New In-vitro Pharamcology Screening Summary
        else {
          this.title = 'Register New In-vitro Pharmacology Summary';
          setTimeout(() => {
            this.titleService.setTitle(`Register In-vitro Pharmacology Summary`);
            this.invitroPharmacologyService.loadAssay();
            this.assay = this.invitroPharmacologyService.assay;

            // *************** Get All Existing Assays suggestions/TypeAhead
            //this.getAllExistingAssays();

            // Add One row of New Summary when page loads
            this.addNewSummary();

            this.loadingService.setLoading(false);
            this.isLoading = false;
          });
        } // else Register
      });

    this.subscriptions.push(routeSubscription);

    // Get All Existing Assays suggestions/TypeAhead
    //this.getAllExistingAssays();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getTestAgentSummariesDetails(newType?: string): void {
    if (this.id != null) {
      const getInvitroSubscribe = this.invitroPharmacologyService.getTestAgentSummaries(this.id).subscribe(response => {
        if (response) {

         // this.invitroPharmacologyService.loadScreening(response);
          this.screeningList = response;

          if (this.screeningList.length > 0) {
          if (this.screeningList[0].invitroTestAgent)
            if (this.screeningList[0].invitroTestAgent.testAgentSubstanceUuid) {
              this.testAgentSubstanceUuid = this.screeningList[0].invitroTestAgent.testAgentSubstanceUuid;
              this.testAgent = this.screeningList[0].invitroTestAgent.testAgent;
            }
          }

          this.screeningList.forEach(screening => {
            if (screening) {
              if (screening.invitroSummary) {
                if (screening.invitroSummary.targetNameSubstanceUuid) {

                }
              }
            }
          });

          this.loadingService.setLoading(false);
          this.isLoading = false;
        }
      }, error => {
        this.loadingService.setLoading(false);
        this.isLoading = false;
        this.handleRecordRetrivalError();
      });
      this.subscriptions.push(getInvitroSubscribe);
    }
  }

  getAllExistingAssays() {
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllAssays().subscribe(response => {
      if (response) {
        this.existingAssayList = response;

       // this.addNewSummary();
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

  getAllAssaySets() {
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllAssaySets().subscribe(response => {
      if (response) {
        this.existingAssaySetList = response;
      }

      this.loadingService.setLoading(false);
      this.isLoading = false;
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
    });
    this.subscriptions.push(getInvitroSubscribe);
  }

  getAllAssysByAssaySet(assaySet: string) {
    this.assayMessage = "Loading Assays ...";
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllAssysByAssaySet(assaySet).subscribe(response => {
      if (response) {
        /*
        this.existingAssaysByAssaySetList = response;

        // LOOP: assay list
        this.existingAssaysByAssaySetList.forEach((assay, indexAssay) => {
          if (assay.invitroAssayScreenings == null) {
            assay.invitroAssayScreenings = [];
          }
          // add new screening
          const newInvitroAssayScreening: InvitroAssayScreening =
          {
            invitroReference: { invitroSponsor: {} },
            invitroTestAgent: {},
            invitroAssayResult: {},
            invitroLaboratory: {},
            invitroControls: [{}],
            invitroSubmitterReport: { invitroSponsorSubmitters: [{}] }
          };
          assay.invitroAssayScreenings.push(newInvitroAssayScreening);
        }); // LOOP: assay
        */
        this.loadingService.setLoading(false);
        this.isLoading = false;
      }
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.handleRecordRetrivalError();
    });

    this.subscriptions.push(getInvitroSubscribe);
  }

  loadReferencesTypeAhead() {
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllReferences().subscribe(response => {
      if (response) {
        this.existingReferenceList = response;
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
    this.submissionMessage = null;
    this.validationMessages = [];
    this.validationResult = true;

    // Validate Test Agent
    /*
    if (this.testAgent == null) {
      this.setValidationMessage('Test Agent is required');
    }*/

     // Validate Target Name
     this.screeningList.forEach((screening, index) => {
        if (screening) {

          screening.testing = "RRRRRRRRRRRRRRRR";

          /*if (screening.invitroSummary) {
            if (!screening.invitroSummary.targetNameSubstanceUuid) {
              this.setValidationMessage('Target Name is required in row ' + (index+1));
            }
          } */
        }
     });

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
      this.router.navigate(['/invitro-pharm/summary/register']);
     // this.invitroPharmacologyService.loadScreening();
    }, 5000);
  }

  submit() {
    this.isLoading = true;
    this.loadingService.setLoading(true);

    let assaySavedCount = 0;

    this.invitroPharmacologyService.saveMultipleScreenings(this.screeningList).subscribe(response => {

      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.validationMessages = null;
      this.submissionMessage = 'In-vitro Pharmacology Assay Summary data was saved successfully!';
      this.showSubmissionMessages = true;
      this.validationResult = false;
      setTimeout(() => {
        this.showSubmissionMessages = false;
        this.submissionMessage = '';

        let id = null;
        if (response) {
          if (response[0].invitroTestAgent) {
            if (response[0].invitroTestAgent.testAgent) {
              id = response[0].invitroTestAgent.id;
              if (id) {
                // Saved Successfully, reload this update page
                this.invitroPharmacologyService.bypassUpdateCheck();
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['/invitro-pharm/summary/', id, 'edit']);
              }
            }
          }
        } // response
      }, 4000);

    });
    /*
    //LOOP through each Assay, and save.  Save Multiple Assays.
    for (const assay of this.newAssayList) {

      // Set service assay
      this.invitroPharmacologyService.assay = assay;

      this.invitroPharmacologyService.saveAssay().subscribe(response => {
        if (response) {

          // If record is saved, increase count by 1
          assaySavedCount = assaySavedCount + 1;

          if (this.newAssayList.length == assaySavedCount) {

            this.loadingService.setLoading(false);
            this.isLoading = false;

            // Forward to Test Agent page
            this.invitroPharmacologyService.bypassUpdateCheck();
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/invitro-pharm'], { queryParams: { view: 'all-testagents' } });
          }
        }
        // Error saving record
        else {
          this.loadingService.setLoading(false);
          this.isLoading = false;

          console.log("Regiser Invitro Pharmacology Summary - ERROR Saving Summary Data");
        } // else
      }); // save Subscribe
      */

   // } // for assay

  }

  showJSON(): void {
    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
     // data: this.scrub(this.newAssayList)
     data: this.screeningList
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
            this.router.navigateByUrl('/invitro-pharm/summary/register?action=import', { state: { record: response } });
          }
        }, 1000);
      }
      // }
      // }
    });
  }

  addNewSummary() {
    const newAssay: InvitroAssayInformation = {invitroAssayScreenings: [{invitroSummary: {}}]};

    let newScreening: InvitroAssayScreening = {invitroSummary: {}, invitroTestAgent: {}};
    newAssay._existingAssayList = this.existingAssayList;

    this.screeningList.push(newScreening);
    this.assayList.push(newAssay);
  }

  confirmDeleteAssay(indexScreening: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Summary record ' + (indexScreening + 1) + ' ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteAssay(indexScreening);
      }
    });
  }

  deleteAssay(indexScreening: number) {
    this.screeningList.splice(indexScreening, 1);
  }

  displayMessageAfterDeleteSummarities() {
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

  testAgentUpdated(substance: SubstanceSummary): void {
    if (substance != null) {
      this.testAgentSubstanceUuid = substance.uuid
      this.testAgent = substance._name;

      this.screeningList.forEach(screening => {
        if (screening) {
          screening.invitroTestAgent.testAgent = 'AAAAAAAAAAA';
          screening.invitroTestAgent.id = 1;
          screening.invitroTestAgent.internalVersion = 2;
        }
      });
    }
  }

  targetNameUpdated(substance: SubstanceSummary, indexScreening: number): void {
    if (substance != null) {
      this.screeningList[indexScreening].invitroSummary.targetNameSubstanceUuid = substance.uuid;
      this.screeningList[indexScreening].invitroSummary.targetName = substance._name;
    }
  }

  nameSearch(event: any, fieldName: string, screeningIndex): void {

    if (fieldName && fieldName === 'testAgent') {
      this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgent = event;
    } else if (fieldName === 'humanHomologTarget') {
      this.assay.humanHomologTarget = event;
    } else if (fieldName === 'ligandSubstrate') {
      this.assay.ligandSubstrate = event;
    }

    const substanceSubscribe = this.generalService.getSubstanceByName(event).subscribe(response => {
      if (response) {
        if (response.content && response.content.length > 0) {
          const substance = response.content[0];

          // If Substance found
          if (substance) {

            // Assign Substance UUID
            if (fieldName && fieldName === 'testAgent') {
              this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentSubstanceUuid = substance.uuid;
            }

            // Assign Substance Approval ID
            if (substance.approvalID) {

              if (fieldName && fieldName === 'testAgent') {
                // Assign to Test Agent Approval ID
                this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentApprovalId = substance.approvalID;
              }
            } // if Substance Approval ID exists

            // Assign to Structure Smiles and Formula Weight
            if (substance.structure) {
              if (substance.structure.smiles) {
                this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentSmileString = substance.structure.smiles;
              }
              if (substance.structure.formula) {
                this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentMolecularFormulaWeight = substance.structure.formula;
              }
            } // if Substance Structure exists

          } // if Substance exists
        } // if response content > 0
      } // if response
    });
    this.subscriptions.push(substanceSubscribe);
  }

  selectionChangeExistingAssay(event, indexAssay) {
    let existingAssayIndex = event.value;

    // Select the assay
    const newAssay = this.existingAssayList[existingAssayIndex];

    // Set data in the summary object
  //  const newSummary = this.assayList[indexAssay].invitroAssayScreenings;
  //  newSummary.testAgent = this.testAgent;
  //  newSummary.testAgentSubstanceUuid = this.testAgentSubstanceUuid;

   // newAssay.invitroSummaries.push(newSummary);
    this.newAssayList.push(newAssay);

    this.assayList[indexAssay].targetName = newAssay.targetName;

  }

  selectionChangeExistingReference(event) {
    if (event) {
      let reference = (event.split('||'));
      this.assay.invitroAssayScreenings[0].invitroReference.referenceSourceType = reference[0];
      this.assay.invitroAssayScreenings[0].invitroReference.referenceSource = reference[1];

      this.referenceMessage = "";
    }
  }

  selectionChangeExistingTestAgent(event, screeningIndex) {

  }

  setApplyAllData(checkBoxValue: any): void {
    if (checkBoxValue === true) {
      /*
      let indexFirstAssay = this.assayList[0].invitroSummaries.length - 1;
      this.assayList.forEach((assay, indexAssay) => {
        if (indexAssay != 0) {
          let indexSummaries = assay.invitroSummaries.length - 1;

          //Copy Summary data from first row to all the other rows
          assay.invitroSummaries[indexSummaries].resultType = this.assayList[0].invitroSummaries[indexSummaries].resultType;
          // assay.invitroAssayScreenings[indexScreening].invitroAssayResult.testAgentConcentrationUnits = this.existingAssaysByAssaySetList[0].invitroAssayScreenings[indexFirstAssayScreening].invitroAssayResult.testAgentConcentrationUnits;
          // assay.invitroAssayScreenings[indexScreening].invitroAssayResult.resultValue = this.existingAssaysByAssaySetList[0].invitroAssayScreenings[indexFirstAssayScreening].invitroAssayResult.resultValue;
          // assay.invitroAssayScreenings[indexScreening].invitroAssayResult.resultValueUnits = this.existingAssaysByAssaySetList[0].invitroAssayScreenings[indexFirstAssayScreening].invitroAssayResult.resultValueUnits;

        }
      }); */
    }
  }

  setPlasmaProteinCheckBox(checkBoxValue: any, screeningIndex: number): void {
    this.assay.invitroAssayScreenings[screeningIndex].invitroAssayResult.plasmaProteinAdded = checkBoxValue;
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
    delete old['_existingAssayList'];

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
