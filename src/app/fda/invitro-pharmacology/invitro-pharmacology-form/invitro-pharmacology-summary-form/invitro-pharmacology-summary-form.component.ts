import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { DatePipe, formatDate } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription, forkJoin } from 'rxjs';
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
import { StructureImageModalComponent } from '@gsrs-core/structure';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';
import { JsonDialogFdaComponent } from '../../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { SubstanceRelationship, SubstanceSummary, SubstanceRelated, MediatorSubstance } from '@gsrs-core/substance/substance.model';
import { FacetParam } from '@gsrs-core/facets-manager';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../../service/invitro-pharmacology.service';
import { InvitroAssayInformation, InvitroAssayScreening, InvitroSummary, InvitroReference, InvitroTestAgent, ValidationMessage, InvitroAssayResultInformation } from '../../model/invitro-pharmacology.model';
import * as _ from 'lodash';
import jp from 'jsonpath';

@Component({
    selector: 'app-invitro-pharmacology-summary-form',
    templateUrl: './invitro-pharmacology-summary-form.component.html',
    styleUrls: ['./invitro-pharmacology-summary-form.component.scss'],
    standalone: false
})
export class InvitroPharmacologySummaryFormComponent implements OnInit, OnDestroy {

  summaryList: Array<any> = [];
  newTestAgent: InvitroTestAgent = {};   //???? can remove
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  pageSize = 10;
  pageIndex = 0;

  // Need this variables
  testAgentSubstanceUuid: string;
  testAgentSubstanceKey: string;
  testAgent: string;

  assayResults: Array<InvitroAssayInformation> = [];

  assay: InvitroAssayInformation;   //??? can remove
  selectedAssay: InvitroAssayInformation;

  id?: string;

  // Form Control
  existingAssayControl = new FormControl();
  existingAssaySetControl = new FormControl();
  existingReferenceControl = new FormControl();
  existingTestAgentControl = new FormControl();

  // Suggestions/TypeAhead/Dropdown
  existingAssayList: Array<InvitroAssayInformation> = [];
  assayList: Array<InvitroAssayInformation> = [];
  assayListOriginal: Array<InvitroAssayInformation> = [];
  screeningList: Array<InvitroAssayScreening> = [];
  newAssayList: Array<InvitroAssayInformation> = [];
  assayToSave: Array<InvitroAssayInformation> = [];

  existingAssaySetList: Array<any> = [];
  existingReferenceList: Array<InvitroReference> = [];
  existingTestAgentList: Array<InvitroTestAgent> = [];

  resultInfo: InvitroAssayResultInformation = {};

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
    public http: HttpClient,
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
          this.title = 'Update In Vitro Pharmacology Summary';
          if (id !== this.id) {
            this.id = id;
            this.testAgent = this.id;
            this.titleService.setTitle(`Edit In Vitro Pharmacology Summary ` + this.id);
            // Get Assays by Test Agent
            this.getTestAgentSummariesDetails();
          }
        }
        else if (this.activatedRoute.snapshot.queryParams['copyId']) {
          this.id = this.activatedRoute.snapshot.queryParams['copyId'];
          if (this.id) {  //copy from existing Product
            this.titleService.setTitle(`Register In Vitro Pharmacology from Copy ` + this.id);
            this.title = 'Register New Invitro-Pharmacology Summary from Copy Assay Id ' + this.id;
          }
        }
        else if (this.activatedRoute.snapshot.queryParams['action']) {
          let actionParam = this.activatedRoute.snapshot.queryParams['action'];
          if (actionParam && actionParam === 'import' && window.history.state) {
            this.titleService.setTitle(`Register New In Vitro Pharmacology from Import`);
            this.title = 'Register New In Vitro Pharmacology from Import';
            const record = window.history.state.record;
            const response = JSON.parse(record);
            if (response) {
              this.scrub(response);
              this.loadingService.setLoading(false);
              this.isLoading = false;
            }
          }
        }
        // Register New In Vitro Pharamcology Screening Summary
        else {
          this.title = 'Register New In Vitro Pharmacology Summary';
          setTimeout(() => {
            this.titleService.setTitle(`Register In Vitro Pharmacology Summary`);

            this.invitroPharmacologyService.loadAssay();
            this.assay = this.invitroPharmacologyService.assay;

            // Add One row of New Summary when page loads
            this.addNewSummary();

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

  processSubstanceSearch(searchValue: string, indexScreening: number) {
    this.privateSearchTerm = searchValue;
    this.setSearchTermValue(indexScreening);
  }

  setSearchTermValue(indexScreening: number) {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.searchInvitroAssay(indexScreening);
  }

  searchInvitroAssay(indexScreening: number) {
    this.loadingService.setLoading(true);
    let order = "root_modifiedDate";
    let skip = this.pageIndex * this.pageSize;
    const subscription = this.invitroPharmacologyService.getInvitroPharmacology(
      order,
      skip,
      this.pageSize,
      this.privateSearchTerm,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.screeningList[indexScreening]._assayResults = pagingResponse.content;

      }, error => {
        console.log('error');
        const notification: AppNotification = {
          message: 'There was an error trying to retrieve In Vitro pharmacology data. Please refresh and try again.',
          type: NotificationType.error,
          milisecondsToShow: 6000
        };
        // this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.mainNotificationService.setNotification(notification);
      }, () => {
        subscription.unsubscribe();
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      });
  }

  getTestAgentSummariesDetails(newType?: string): void {
    if (this.id != null) {
      const getInvitroSubscribe = this.invitroPharmacologyService.getTestAgentSummaries(this.id).subscribe(response => {
        if (response) {

          this.assayList = response;
          this.assayListOriginal = _.cloneDeep(response);
          this.assayToSave = _.cloneDeep(response);

          if (this.assayList.length > 0) {

            this.assayList.forEach(assay => {
              if (assay) {
                assay.invitroAssayScreenings.forEach(screening => {
                  if (screening) {
                    if (screening.invitroAssayResultInformation) {
                      if (screening.invitroAssayResultInformation.invitroTestAgent) {
                        if (screening.invitroAssayResultInformation.invitroTestAgent.testAgent) {
                          if (screening.invitroAssayResultInformation.invitroTestAgent.testAgent === this.testAgent) {

                            if (screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceKey) {
                              this.testAgentSubstanceKey = screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceKey;
                            }

                            if (screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid) {
                              this.testAgentSubstanceUuid = screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid;
                            }
                            screening._selectedAssay = assay;

                            this.screeningList.push(screening);

                          }
                        }
                      }
                    }
                  }
                });
              }
            });

          } // if assayList.length > 0
          // Loop Screenings

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
        this.submissionMessage = 'In Vitro Pharmacology Assay Summary is Valid. Would you like to submit?';
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

    if (this.testAgentSubstanceUuid == null) {
      this.setValidationMessage('Test Agent is required');
    }

    // Validate Target Name
    this.screeningList.forEach((screening, index) => {
      if (screening) {

        if (!screening._selectedAssay) {
          this.setValidationMessage('Assay is required in row ' + (index + 1));
        }

        if (screening.invitroSummary) {
          if (!screening.invitroSummary.targetNameSubstanceKey) {
            this.setValidationMessage('Target Name is required in row ' + (index + 1));
          }

          if (screening.invitroSummary.resultValueAverage) {
            if (this.isNumber(screening.invitroSummary.resultValueAverage) === false) {
              this.setValidationMessage('Result Value Average must be a number in row ' + (index + 1));
            }
          }

          if (screening.invitroSummary.resultValueLow) {
            if (this.isNumber(screening.invitroSummary.resultValueLow) === false) {
              this.setValidationMessage('Result Value Low must be a number in row ' + (index + 1));
            }
          }

          if (screening.invitroSummary.resultValueHigh) {
            if (this.isNumber(screening.invitroSummary.resultValueHigh) === false) {
              this.setValidationMessage('Result Value High must be a number in row ' + (index + 1));
            }
          }
        }
      } // if screening
    }); // forEach

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
      message: 'The In Vitro pharmacology record you\'re trying to edit doesn\'t exist.',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/invitro-pharm/summary/register']);
      // this.invitroPharmacologyService.loadScreening();
    }, 5000);
  }

  copyScreeningToAssay() {
    this.assayToSave.forEach(assay => {
      if (assay) {
        assay.invitroAssayScreenings.forEach(screening => {
          if (screening) {
            if (screening.id) {
              // Get the index
              let screeningIdIndex = this.screeningList.findIndex(record => record.id === screening.id);
              if (screeningIdIndex > -1) {
                if (this.screeningList[screeningIdIndex].invitroSummary) {
                  // Copy from form fields to screening before saving
                  screening.invitroSummary = this.screeningList[screeningIdIndex].invitroSummary;
                }
              }
            } else {
              // if new summary added
              let screeningIdIndex = this.screeningList.findIndex(record => record._selectedAssay.id == assay.id);
              screening.invitroSummary = this.screeningList[screeningIdIndex].invitroSummary;
            }
          }
        });

      } // if assay
    });
  }

  checkIfDataChanged() {
    let assayToRemoveIndex = [];
    this.assayListOriginal.forEach(assayOriginal => {
      if (assayOriginal) {
        this.assayToSave.forEach((assaySave, index) => {
          if (assaySave) {
            if (assayOriginal.id == assaySave.id) {
              // Clean/Delete extra fields
              let assaySaveClean = this.cleanData(assaySave);

              let isSame = this.isJSONSame(assayOriginal, assaySaveClean);
              // if Data has changed, then save Assay into the database, otherwise will get
              // change not detected error in the backend server.
              if (isSame) {
                assayToRemoveIndex.push(index);
              }
            }
          }
        });
      }
    });
    
    for (var i = assayToRemoveIndex.length -1; i >= 0; i--)
      this.assayToSave.splice(assayToRemoveIndex[i],1);

  }

  submit() {
    this.saveBulkAssays();
  }

  saveBulkAssays(skipFirstRecord?: boolean) {

    this.loadingService.setLoading(true);
    this.isLoading = true;

    let assayApiUrlList: any = [];

    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };

    if (this.id) {
      // Call this function only during editing
      // Copy form fields before saving
      this.copyScreeningToAssay();

      this.checkIfDataChanged();
    }

    const url = this.invitroPharmacologyService.apiBaseUrlWithInvitroPharmEntityUrl;

    // Clean/remove extra fields
    // let cleanAssayToSave = this.cleanData(this.assayToSave);

    this.assayToSave.forEach((assay, indexAssay) => {
      if (skipFirstRecord == true && indexAssay == 0) {
        // Do not save the first assay record
      } else {
        const apiUrl = this.http.put<InvitroAssayInformation>(url, assay, options).pipe(
          //  catchError(error => { throw error; })
        );

        assayApiUrlList.push(apiUrl);
      }
    });

    let savedCount = 0;
    // Save Assays into the database
    forkJoin(assayApiUrlList).subscribe(
      results => {
        let resultList: any = [];
        resultList = results;
        // return list of array of the result
        resultList.forEach(result => {
          if (result.id) {
            savedCount = savedCount + 1;
          }
        });

        // if all the records are saved, refresh the page
        if (savedCount == assayApiUrlList.length) {
        
          this.reloadPageAfterSave();

          /*
          this.validationMessages = null;
          this.submissionMessage = 'In Vitro Pharmacology Summary data was saved successfully!';
          this.showSubmissionMessages = true;
          this.validationResult = false;

          setTimeout(() => {
            if (this.testAgent) {
              // Saved Successfully, reload this update page
              this.invitroPharmacologyService.bypassUpdateCheck();
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['/invitro-pharm/summary/', this.testAgent, 'edit']);
            }
          }, 4000);
          */
        } else {
          alert("Something went wrong while saving Summary data");
        }

        this.isLoading = false;
        this.loadingService.setLoading(false);
      },
    )

    if (this.assayToSave.length == 0) {
      this.reloadPageAfterSave();

      this.isLoading = false;
      this.loadingService.setLoading(false);
    }
  }

  reloadPageAfterSave() {
    this.validationMessages = null;
    this.submissionMessage = 'In Vitro Pharmacology Summary data was saved successfully!';
    this.showSubmissionMessages = true;
    this.validationResult = false;

    setTimeout(() => {
      if (this.testAgent) {
        // Saved Successfully, reload this update page
        this.invitroPharmacologyService.bypassUpdateCheck();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/invitro-pharm/summary/', this.testAgent, 'edit']);
      }
    }, 4000);
  }

  isJSONSame(obj1: any, obj2: any): boolean {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    if (obj1Keys.length !== obj2Keys.length) {
      return false;
    }

    for (const key of obj1Keys) {
      if (obj1.hasOwnProperty(key) !== obj2.hasOwnProperty(key)) {
        return false;
      } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        if (!this.isJSONSame(obj1[key], obj2[key])) {
          return false;
        }
      } else if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }

  showJSON(): void {
    const date = new Date();
    let jsonFilename = 'invitro_pharm_assay_summary_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    this.copyScreeningToAssay();

    let data = { jsonData: this.assayToSave, jsonFilename: jsonFilename };

    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: data
    });

    // Close Dialog
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  saveJSON(): void {
    const date = new Date();
    this.jsonFileName = 'invitro_pharm_assay_summary_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    this.copyScreeningToAssay();

    let json = this.assayToSave;

    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));

    this.downloadJsonHref = uri;
  }

  importJSON(): void {
    let data: any;
    data = {
      title: 'Assay Summary Record Import',
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

        setTimeout(() => {
          this.router.onSameUrlNavigation = 'reload';
          this.loadingService.setLoading(false);
          if (!this.id) {
            // new record
            this.router.navigateByUrl('/invitro-pharm/summary/register?action=import', { state: { record: response } });
          }
        }, 1000);
      }
    });
  }

  addNewSummary() {
    const newAssay: InvitroAssayInformation = { invitroAssayScreenings: [{ invitroSummary: {} }] };

    let newScreening: InvitroAssayScreening = { invitroSummary: {}, invitroAssayResultInformation: {invitroTestAgent: {}} };

    // Assign Test Agent
    newScreening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid = this.testAgentSubstanceUuid;
    newScreening.invitroAssayResultInformation.invitroTestAgent.testAgent = this.testAgent;
  
    this.screeningList.push(newScreening);

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
        message: 'This In Vitro pharmacology assay screening record was deleted successfully',
        type: 'home'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/home']);
    });
  }

  testAgentUpdated(substance: SubstanceSummary): void {
    if (substance != null) {
      this.testAgentSubstanceUuid = substance.uuid;
      this.testAgent = substance._name;

      this.screeningList.forEach(screening => {
        if (screening) {
          if (screening.invitroAssayResultInformation) {
            if (screening.invitroAssayResultInformation.invitroTestAgent == null) {
              screening.invitroAssayResultInformation.invitroTestAgent = {};
            }
            screening.invitroAssayResultInformation.invitroTestAgent.testAgent = substance._name;
            screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid = substance.uuid;
          }
        }
      });
    }
  }

  targetNameUpdated(substance: SubstanceSummary, indexScreening: number): void {
    if (substance != null) {
      this.screeningList[indexScreening].invitroSummary.targetNameSubstanceKey = substance.uuid;
      this.screeningList[indexScreening].invitroSummary.targetName = substance._name;
    }
  }

  nameSearch(event: any, fieldName: string, screeningIndex): void {

    if (fieldName && fieldName === 'testAgent') {
      // this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgent = event;
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
              //  this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentSubstanceUuid = substance.uuid;
            }

            // Assign Substance Approval ID
            if (substance.approvalID) {

              if (fieldName && fieldName === 'testAgent') {
                // Assign to Test Agent Approval ID
                //  this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentApprovalId = substance.approvalID;
              }
            } // if Substance Approval ID exists

            // Assign to Structure Smiles and Formula Weight
            if (substance.structure) {
              if (substance.structure.smiles) {
                //   this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentSmileString = substance.structure.smiles;
              }
              if (substance.structure.formula) {
                //    this.assay.invitroAssayScreenings[screeningIndex].invitroTestAgent.testAgentMolecularFormulaWeight = substance.structure.formula;
              }
            } // if Substance Structure exists

          } // if Substance exists
        } // if response content > 0
      } // if response
    });
    this.subscriptions.push(substanceSubscribe);
  }

  changeSelectionRadioAssay(event, indexAssayResult: number, indexScreening: number) {
    let existingAssayIndex = event.value;

    // Select the assay
    this.screeningList[indexScreening]._selectedAssay = this.screeningList[indexScreening]._assayResults[indexAssayResult];

    if (this.screeningList[indexScreening]._selectedAssay != null) {
      if (this.screeningList[indexScreening]._selectedAssay.targetNameSubstanceKey) {
        this.screeningList[indexScreening].invitroSummary.targetNameSubstanceKey = this.screeningList[indexScreening]._selectedAssay.targetNameSubstanceKey;
      }
    }
    this.screeningList[indexScreening]._assayResults = [];

    let assay = _.cloneDeep(this.screeningList[indexScreening]._selectedAssay);
    assay.invitroAssayScreenings.push(this.screeningList[indexScreening]);

    this.assayToSave.push(assay);
  }

  /*
  selectionChangeExistingAssay(event, indexAssay: number) {
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
  */

  selectionChangeExistingReference(event) {
    if (event) {
      let reference = (event.split('||'));
      //  this.assay.invitroAssayScreenings[0].invitroReference.referenceSourceType = reference[0];
      //  this.assay.invitroAssayScreenings[0].invitroReference.referenceSource = reference[1];

      this.referenceMessage = "";
    }
  }

  selectionChangeExistingTestAgent(event, screeningIndex) {

  }

  setPlasmaProteinCheckBox(checkBoxValue: any, screeningIndex: number): void {
    this.assay.invitroAssayScreenings[screeningIndex].invitroAssayResult.plasmaProteinAdded = checkBoxValue;
  }

  cleanData(oldraw: any): any {
    const old = oldraw;

    const assayResults = jp.query(old, '$..[?(@._assayResults)]');
    for (let i = 0; i < assayResults.length; i++) {
      delete assayResults[i]._assayResults;
    }

    const selectedAssay = jp.query(old, '$..[?(@._selectedAssay)]');
    for (let i = 0; i < selectedAssay.length; i++) {
      delete selectedAssay[i]._selectedAssay;
    }

    return old;
  }

  isNumber(str: any): boolean {
    if (str) {
      const num = Number(str);
      const nan = isNaN(num);
      return !nan;
    }
    return false;
  }

  scrub(oldraw: any): any {
    const old = oldraw;
    const idHolders = jp.query(old, '$..[?(@.id)]');
    for (let i = 0; i < idHolders.length; i++) {
      if (idHolders[i].id) {
        delete idHolders[i].id;
      }
    }

    const createHolders = jp.query(old, '$..[?(@.creationDate)]');
    for (let i = 0; i < createHolders.length; i++) {
      delete createHolders[i].creationDate;
    }

    const createdByHolders = jp.query(old, '$..[?(@.createdBy)]');
    for (let i = 0; i < createdByHolders.length; i++) {
      delete createdByHolders[i].createdBy;
    }

    const modifyHolders = jp.query(old, '$..[?(@.lastModifiedDate)]');
    for (let i = 0; i < modifyHolders.length; i++) {
      delete modifyHolders[i].lastModifiedDate;
    }

    const modifiedByHolders = jp.query(old, '$..[?(@.modifiedBy)]');
    for (let i = 0; i < modifiedByHolders.length; i++) {
      delete modifiedByHolders[i].modifiedBy;
    }

    const intVersionHolders = jp.query(old, '$..[?(@.internalVersion)]');
    for (let i = 0; i < intVersionHolders.length; i++) {
      delete intVersionHolders[i].internalVersion;
    }

    const assayResults = jp.query(old, '$..[?(@._assayResults)]');
    for (let i = 0; i < assayResults.length; i++) {
      delete assayResults[i]._assayResults;
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

}
