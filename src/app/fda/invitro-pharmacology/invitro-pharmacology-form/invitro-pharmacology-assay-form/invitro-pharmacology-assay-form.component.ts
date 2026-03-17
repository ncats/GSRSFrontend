import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { DatePipe, formatDate } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { forkJoin, Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

/* GSRS Core Imports */
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ConfigService } from '@gsrs-core/config';
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

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../../service/invitro-pharmacology.service'
import { InvitroAssayInformation, InvitroAssaySet, ValidationMessage } from '../../model/invitro-pharmacology.model';
import jp from 'jsonpath';

@Component({
  selector: 'app-invitro-pharmacology-assay-form',
  templateUrl: './invitro-pharmacology-assay-form.component.html',
  styleUrls: ['./invitro-pharmacology-assay-form.component.scss'],
  standalone: false
})

export class InvitroPharmacologyAssayFormComponent implements OnInit, OnDestroy {

  @ViewChildren('checkBox') checkBox: QueryList<any>;

  private TARGET_NAME = "TARGET_NAME";
  private HUMAN_HOMOLOG_TARGET = "HUMAN_HOMOLOG_TARGET";
  private LIGAND_SUBSTRATE = "LIGAND_SUBSTRATE";
  private ANALYTE = "ANALYTE";

  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];
  private substanceSelectorProperties: Array<string> = null;

  assay: InvitroAssayInformation;
  id: number;

  newAssaySetObject: InvitroAssaySet;
  newAssaySet: string;

  checkBoxAssaySetList: Array<any> = [];
  existingAssaySetList: Array<any> = [];

  errorMessage: string;
  serverError: boolean;
  submissionMessage: string;
  showSubmissionMessages = false;
  validationResult = false;
  validationMessages: Array<ValidationMessage> = [];
  message = '';

  downloadJsonHref: any;
  jsonFileName: string;

  isLoading = true;
  username = null;
  title = null;
  substanceKeyTypeForInvitroPharmacologyConfig = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private titleService: Title,
    private overlayContainerService: OverlayContainer,
    private authService: AuthService,
    private configService: ConfigService,
    private substanceService: SubstanceService,
    private cvService: ControlledVocabularyService,
    private utilsService: UtilsService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private generalService: GeneralService,
    private invitroPharmacologyService: InvitroPharmacologyService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.loadingService.setLoading(this.isLoading);
      this.overlayContainer = this.overlayContainerService.getContainerElement();

      // Get Username
      this.username = this.authService.getUser();

      // Get Invitro Pharmacology Substance Key Type from the configuration file
      this.substanceKeyTypeForInvitroPharmacologyConfig = this.generalService.getSubstanceKeyTypeForInvitroPharmacologyConfig();

      if (this.configService.configData.substanceSelectorProperties != null) {
        this.substanceSelectorProperties = this.configService.configData.substanceSelectorProperties;
      } else {
        console.log("The config value for substanceSelectorProperties is null.");
      }

      const routeSubscription = this.activatedRoute
        .params
        .subscribe(params => {
          if (params['id']) {
            const id = params['id'];
            this.title = 'Update In Vitro Pharmacology Assay Only';
            if (id !== this.id) {
              this.id = id;
              this.titleService.setTitle(`Edit In Vitro Pharmacology Assay Only ` + this.id);
              // Get existing Assay
              this.getInvitroPharmacologyDetails();
            }
          }
          // Copy Assay and register New Assay
          else if (this.activatedRoute.snapshot.queryParams['copyId']) {
            this.id = this.activatedRoute.snapshot.queryParams['copyId'];
            if (this.id) {  //copy from existing Assay
              this.titleService.setTitle(`Register In Vitro Pharmacology from Copy ` + this.id);
              this.title = 'Register New In Vitro Pharmacology Assay from Copy Assay Id ' + this.id;
              // Do Something. Will Implement Later
            }
          }
          // Import JSON and register New Assay
          else if (this.activatedRoute.snapshot.queryParams['action']) {
            let actionParam = this.activatedRoute.snapshot.queryParams['action'];
            if (actionParam && actionParam === 'import' && window.history.state) {
              this.titleService.setTitle(`Register New In Vitro Pharamcology Assay from Import`);
              this.title = 'Register In Vitro Pharamcology Assay from Import';
              const record = window.history.state.record;
              if (record) {
                const response = JSON.parse(record);
                if (response) {
                  // Delete ids and audit details from imported Assay JSON
                  this.scrub(response);

                  // Load Assay JSON into Assay Objects if value in Assay Id exists
                  this.invitroPharmacologyService.loadAssayOnly(response);
                  this.assay = this.invitroPharmacologyService.assay;

                  // Get All the Assay Sets for checkboxes on the form
                  this.getAllAssaySets();

                  // Get Substance Details
                  this.getSubstanceDetailsForImport();

                  // Stop the Loading/Spinner after the form data is loaded
                  this.isLoading = false;
                  this.loadingService.setLoading(this.isLoading);
                } // if response
              } // if record has JSON
              else {
                // if No JSON file selected, show message to user
                // Initialized the Assay Objects
                this.invitroPharmacologyService.loadAssayOnly();
                this.assay = this.invitroPharmacologyService.assay;

                // Get All the Assay Sets for checkboxes on the form
                this.getAllAssaySets();

                // Stop the Loading/Spinner after the form data is loaded
                this.isLoading = false;
                this.loadingService.setLoading(this.isLoading);

                alert("There was no JSON file selected to import the data. Please click the 'Import JSON' button");
              }
            }
          }  // else if Import Assay

          // Register New Assay
          else {
            this.title = 'Register New In Vitro Pharmacology Assay Only';
            setTimeout(() => {
              this.titleService.setTitle(`Register In Vitro Pharmacology Assay Only`);

              // Assign new Assay Objects to load on the form
              this.invitroPharmacologyService.loadAssayOnly();
              this.assay = this.invitroPharmacologyService.assay;

              // Get All the Assay Sets for checkbox
              this.getAllAssaySets();

              this.loadingService.setLoading(false);
              this.isLoading = false;
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

  getInvitroPharmacologyDetails(newType?: string): void {
    if (this.id != null) {
      const id = this.id.toString();
      const getDetailsSubscribe = this.invitroPharmacologyService.getAssayScreening(id).subscribe(response => {
        if (response) {

          // before copying existing invitro pharmacology record, delete the id
          if (newType && newType === 'copy') {
            // Delete ids and audit details from copy Assay JSON
            this.scrub(response);
          }

          this.invitroPharmacologyService.loadAssayOnly(response);
          this.assay = this.invitroPharmacologyService.assay;

          // Get All the Assay Sets for checkbox
          this.getAllAssaySets();

        } // if response

        // Stop the Loading/Spinner on the form
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      }, error => {
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.handleProductRetrivalError();
      });

      this.subscriptions.push(getDetailsSubscribe);
    }
  }

  getAllAssaySets() {
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllAssaySets().subscribe(response => {
      if (response) {
        this.existingAssaySetList = response;

        // Create checboxes
        this.createAssaySetCheckBoxes();

        if (this.id || this.assay.invitroAssaySets.length > 0) {
          // if Assay record exists, load the Assay set in the checkboxes
          this.loadCheckBoxAssaySetList();
        }

        this.loadingService.setLoading(false);
        this.isLoading = false;
      }
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.handleProductRetrivalError();
    });
    this.subscriptions.push(getInvitroSubscribe);
  }

  getSubstanceDetailsForImport() {
    // Clear these fields
    this.assay.targetNameApprovalId = '';
    this.assay.targetNameSubstanceKey = '';
    this.assay.targetNameSubstanceKeyType = '';

    this.assay.humanHomologTargetApprovalId = '';
    this.assay.humanHomologTargetSubstanceKey = '';
    this.assay.humanHomologTargetSubstanceKeyType = '';

    this.assay.ligandSubstrateApprovalId = '';
    this.assay.ligandSubstrateSubstanceKey = '';
    this.assay.ligandSubstrateSubstanceKeyType = '';

    if (this.assay.targetName) {
      this.nameSearch(this.assay.targetName, this.TARGET_NAME);
    }
    if (this.assay.humanHomologTarget) {
      this.nameSearch(this.assay.humanHomologTarget, this.HUMAN_HOMOLOG_TARGET);
    }
    if (this.assay.ligandSubstrate) {
      this.nameSearch(this.assay.ligandSubstrate, this.LIGAND_SUBSTRATE);
    }

    // Get Analytes
    if (this.assay.invitroAssayAnalytes && this.assay.invitroAssayAnalytes.length > 0) {
      this.assay.invitroAssayAnalytes.forEach((analy, index) => {
        if (analy) {
          if (analy.analyte) {
            this.nameSearch(analy.analyte, this.ANALYTE, index);
            if (!analy.analyteSubstanceKey) {
            }
          }
        }
      });
    }

  }

  createAssaySetCheckBoxes() {
    // Create checkboxes for each existing Assay Set from database
    this.existingAssaySetList.forEach(set => {
      let setObj = { value: set.assaySet, checked: false };
      this.checkBoxAssaySetList.push(setObj);
    });
  }

  loadCheckBoxAssaySetList() {
    // For existing Assay, when loading data, loop through the associated assay sets, and assign check in the checkbox
    if (this.assay) {
      if (this.assay.invitroAssaySets) {
        if (this.assay.invitroAssaySets.length > 0) {
          this.assay.invitroAssaySets.forEach(asySet => {
            if (asySet.assaySet) {
              // Get the index if the value exists in the key 'value'
              const indexSet = this.checkBoxAssaySetList.findIndex(record => record.value === asySet.assaySet);
              // check the box for the found assay set
              this.checkBoxAssaySetList[indexSet].checked = true;
            }
          });
        }
      }
    }
  }

  setSelectedAssaySet($event, data: any, indexCheckbox: number) {
    // To get the actual values instead of just the element
    const checkedItems = this.checkBoxAssaySetList.filter((x, index) => this.checkBox.find((c, i) => i == index).checked).map(x => x.value);

    // Get all the values that are checked.  Loop through the checkboxes and assay.assaySets.
    // add the values in assay.assaySet if not there, or remove if there.

    // Clear the existing lists in the assay
    this.assay.invitroAssaySets = [];

    checkedItems.forEach(assaySet => {
      // Get the index if the value exists in the key 'value'
      const indexSet = this.existingAssaySetList.findIndex(record => record.assaySet === assaySet);

      // found
      if (indexSet > -1) {
        const existingAssaySetObject = this.existingAssaySetList[indexSet];

        // If Assay already exists into the database, or it is not new Assay, or updating the exising Assay,
        // set the entire AssaySet object to Assay's invitroAssaySets list
        if (this.assay.id) { // existing Assay/Update
          // Set the existing AssaySet in the Assay
          this.assay.invitroAssaySets.push(existingAssaySetObject);
        } else {  // New Assay/Register
          const newAssaySet: InvitroAssaySet = {};

          // Push the new object to list
          this.assay.invitroAssaySets.push(existingAssaySetObject);
        }
      } else {  // Not found in the Existing AsssaySets into the database
      }

    });
  }

  addNewAssayAnalyte() {
    this.invitroPharmacologyService.addNewAssayAnalyte();
  }

  addNewAssaySet() {
    this.newAssaySetObject = { assaySet: this.newAssaySet };
    this.existingAssaySetList.push(this.newAssaySetObject);

    let setObj = { value: this.newAssaySet, checked: false };
    this.checkBoxAssaySetList.push(setObj);
  }

  confirmDeleteAnalyte(indexAnalyte: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Analyte record ' + (indexAnalyte + 1) + ' ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteAnalyte(indexAnalyte);
      }
    });
  }

  deleteAnalyte(indexAnalyte: number) {
    this.assay.invitroAssayAnalytes.splice(indexAnalyte, 1);
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
      this.invitroPharmacologyService.validateAssay().pipe(take(1)).subscribe(results => {
        this.submissionMessage = null;
        this.validationMessages = results.validationMessages.filter(
          message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
        this.validationResult = results.valid;
        this.showSubmissionMessages = true;
        this.loadingService.setLoading(false);
        this.isLoading = false;

        if (this.validationMessages.length === 0 && results.valid === true) {
          this.submissionMessage = 'In Vitro Pharmacology is Valid. Would you like to submit?';
        }
      }, error => {
        this.addServerError(error);
        this.loadingService.setLoading(false);
        this.isLoading = false;
      });
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
    this.validationMessages = [];
    this.validationResult = true;

    if (this.assay.standardLigandSubstrateConcentration) {
      if (this.isNumber(this.assay.standardLigandSubstrateConcentration) === false) {
        this.setValidationMessage('Standard Ligand/Substrate Concentration must be a number');
      }
    }

    if (this.assay.targetName) {
      // if Target Name Substance Key is empty, it means Substance not found in the database.
      if (!this.assay.targetNameSubstanceKey) {
        this.setValidationMessage("The Target Name '" + this.assay.targetName + " not found in the database");
      }
    }

    if (this.assay.humanHomologTarget) {
      // if Human Homolog Target Substance Key is empty, it means Substance not found in the database.
      if (!this.assay.humanHomologTargetSubstanceKey) {
        this.setValidationMessage("The Human Homolog Target '" + this.assay.humanHomologTarget + "' not found in the database");
      }
    }

    if (this.assay.ligandSubstrate) {
      // if Ligand Substance Key is empty, it means Substance not found in the database.
      if (!this.assay.ligandSubstrateSubstanceKey) {
        this.setValidationMessage("The Ligand/Substrate '" + this.assay.ligandSubstrate + "' not found in the database");
      }
    }

    // Validate Analytes
    if (this.assay.invitroAssayAnalytes && this.assay.invitroAssayAnalytes.length > 0) {
      this.assay.invitroAssayAnalytes.forEach(analy => {
        if (analy) {
          if (analy.analyte) {
            if (!analy.analyteSubstanceKey) {
              this.setValidationMessage("The Analyte '" + analy.analyte + "' not found in the database");
            }
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
      message: 'The In Vitro pharmacology record you\'re trying to edit doesn\'t exist.',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/invitro-pharm/assay/register']);
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
      this.submissionMessage = 'In Vitro Pharmacology Assay data was saved successfully!';
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
    );
  }

  displayMessageAfterDeleteImpurities() {
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

  showJSON(): void {
    const date = new Date();
    let jsonFilename = 'invitro_pharm_assay_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    let data = { jsonData: this.invitroPharmacologyService.assay, jsonFilename: jsonFilename };

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
        setTimeout(() => {
          this.router.onSameUrlNavigation = 'reload';
          this.loadingService.setLoading(false);
          if (!this.id) {
            // new record
            this.router.navigateByUrl('/invitro-pharm/assay/register?action=import', { state: { record: response } });
          }
        }, 1000);
      }
    });
  }

  cleanObject(object: any): any {
    const oldObj = object;
    if (oldObj) {
      delete oldObj._self;
    }
    return oldObj;
  }

  setSubstanceValues(event: string, fieldName: string, indexRow?: number) {

    const ingredientName = event;

    // Assign Substance/Ingredient name to either Target Name, Human Homolog Target, or Ligand/Substrate
    if (fieldName && fieldName === this.TARGET_NAME) {
      //clear existing values
      this.assay.targetNameApprovalId = '';
      this.assay.targetNameSubstanceKey = '';
      this.assay.targetNameSubstanceKeyType = '';

    } else if (fieldName === this.HUMAN_HOMOLOG_TARGET) {
      this.assay.humanHomologTargetApprovalId = '';
      this.assay.humanHomologTargetSubstanceKey = '';
      this.assay.humanHomologTargetSubstanceKeyType = '';

    } else if (fieldName === this.LIGAND_SUBSTRATE) {
      this.assay.ligandSubstrateApprovalId = '';
      this.assay.ligandSubstrateSubstanceKey = '';
      this.assay.ligandSubstrateSubstanceKeyType = '';

    } else if (fieldName === this.ANALYTE) {
      this.assay.invitroAssayAnalytes[indexRow].analyteSubstanceKey = '';
      this.assay.invitroAssayAnalytes[indexRow].analyteSubstanceKeyType = '';
    }
  }

  searchValueOutChange(event: string, fieldName: string, indexRow?: number) {

    if (fieldName && fieldName === this.TARGET_NAME) {
      this.assay.targetName = event;
    }
    if (fieldName && fieldName === this.HUMAN_HOMOLOG_TARGET) {
      this.assay.humanHomologTarget = event;
    }
    if (fieldName && fieldName === this.LIGAND_SUBSTRATE) {
      this.assay.ligandSubstrate = event;
    }
    if (fieldName && fieldName === this.ANALYTE) {
      this.assay.invitroAssayAnalytes[indexRow].analyte = event;
    }

    this.nameSearch(event, fieldName, indexRow);
  }

  nameSearch(event: any, fieldName: string, indexRow?: number): void {

    // Get Ingredient Name from the Substance Search Textbox (Type Ahead)
    this.setSubstanceValues(event, fieldName, indexRow);

    const q = event.replace('\"', '');
    // Changed to configuration approach.
    const searchStr = this.substanceSelectorProperties.map(property => `${property}:\"^${q}$\"`).join(' OR ');

    // Get Substance record by Ingredient/Substance Name, to get Substance UUID and Approval ID
    const substanceSubscribe = this.substanceService.getQuickSubstancesSummaries(searchStr, true).subscribe(response => {

      if (response) {
        if (response.content && response.content.length > 0) {

          let substance = response.content[0];

          if (substance) {
            /****************************************************************/
            /* SUBSTANCE KEY RESOLVER BEGIN                                 */
            /****************************************************************/
            let substanceKey = this.generalService.getSubstanceKeyBySubstanceResolver(substance, this.substanceKeyTypeForInvitroPharmacologyConfig);

            // Set the Substance Key and Substance Key Type
            if (fieldName && fieldName === this.TARGET_NAME) {
              this.assay.targetNameApprovalId = substance.approvalID;
              this.assay.targetNameSubstanceKey = substanceKey;
              this.assay.targetNameSubstanceKeyType = this.substanceKeyTypeForInvitroPharmacologyConfig;

            } else if (fieldName === this.HUMAN_HOMOLOG_TARGET) {
              this.assay.humanHomologTargetApprovalId = substance.approvalID;
              this.assay.humanHomologTargetSubstanceKey = substanceKey;
              this.assay.humanHomologTargetSubstanceKeyType = this.substanceKeyTypeForInvitroPharmacologyConfig;

            } else if (fieldName === this.LIGAND_SUBSTRATE) {
              this.assay.ligandSubstrateApprovalId = substance.approvalID;
              this.assay.ligandSubstrateSubstanceKey = substanceKey;
              this.assay.ligandSubstrateSubstanceKeyType = this.substanceKeyTypeForInvitroPharmacologyConfig;

            } else if (fieldName === this.ANALYTE) {
              this.assay.invitroAssayAnalytes[indexRow].analyteSubstanceKey = substanceKey;
              this.assay.invitroAssayAnalytes[indexRow].analyteSubstanceKeyType = this.substanceKeyTypeForInvitroPharmacologyConfig;
            }
            // SUBSTANCE KEY RESOLVER END

          } // if Substance exists

        } // if response content > 0
      } // if response
    }); // subscribe 
    this.subscriptions.push(substanceSubscribe);
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

    const assayIdHolders = jp.query(old, '$..[?(@.assayId)]');
    for (let i = 0; i < assayIdHolders.length; i++) {
      if (assayIdHolders[i].assayId) {
        delete assayIdHolders[i].assayId;
      }
    }

    const createHolders = jp.query(old, '$..[?(@.createdDate)]');
    for (let i = 0; i < createHolders.length; i++) {
      delete createHolders[i].createdDate;
    }

    const createdByHolders = jp.query(old, '$..[?(@.createdBy)]');
    for (let i = 0; i < createdByHolders.length; i++) {
      delete createdByHolders[i].createdBy;
    }

    const modifyHolders = jp.query(old, '$..[?(@.modifiedDate)]');
    for (let i = 0; i < modifyHolders.length; i++) {
      delete modifyHolders[i].modifiedDate;
    }

    const modifiedByHolders = jp.query(old, '$..[?(@.modifiedBy)]');
    for (let i = 0; i < modifiedByHolders.length; i++) {
      delete modifiedByHolders[i].modifiedBy;
    }

    const intVersionHolders = jp.query(old, '$..[?(@.internalVersion)]');
    for (let i = 0; i < intVersionHolders.length; i++) {
      if (intVersionHolders[i].internalVersion) {
        delete intVersionHolders[i].internalVersion;
      }
    }

    delete old['id'];
    delete old['createdDate'];
    delete old['createdBy'];
    delete old['modifiedBy'];
    delete old['modifiedDate'];
    delete old['internalVersion'];
    //delete old['externalAssaySource'];
    //delete old['externalAssayId'];
    delete old['$$update'];
    delete old['_self'];

    return old;
  }

}
