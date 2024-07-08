import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
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
import { InvitroAssayInformation, InvitroAssaySet, ValidationMessage } from '../../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-assay-form',
  templateUrl: './invitro-pharmacology-assay-form.component.html',
  styleUrls: ['./invitro-pharmacology-assay-form.component.scss']
})

export class InvitroPharmacologyAssayFormComponent implements OnInit, OnDestroy {

  @ViewChildren('checkBox') checkBox: QueryList<any>;

  private TARGET_NAME = "TARGET_NAME";
  private HUMAN_HOMOLOG_TARGET = "HUMAN_HOMOLOG_TARGET";
  private LIGAND_SUBSTRATE = "LIGAND_SUBSTRATE";
  private ANALYTE = "ANALYTE";

  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];

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

  isAdmin = false;
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

      // Check if user has either Admin or Updater role
      this.authService.hasAnyRolesAsync('DataEntry', 'SuperDataEntry', 'Admin').subscribe(response => {
        this.isAdmin = response;
      });

      // Get Username
      this.username = this.authService.getUser();

      // Get Invitro Pharmacology Substance Key Type from the configuration file
      this.substanceKeyTypeForInvitroPharmacologyConfig = this.generalService.getSubstanceKeyTypeForInvitroPharmacologyConfig();

      const routeSubscription = this.activatedRoute
        .params
        .subscribe(params => {
          if (params['id']) {
            const id = params['id'];
            this.title = 'Update In-vitro Pharmacology Assay Only';
            if (id !== this.id) {
              this.id = id;
              this.titleService.setTitle(`Edit In-vitro Pharmacology Assay Only ` + this.id);
              // Get existing Assay
              this.getInvitroPharmacologyDetails();
            }
          }
          // Copy Assay and register New Assay
          else if (this.activatedRoute.snapshot.queryParams['copyId']) {
            this.id = this.activatedRoute.snapshot.queryParams['copyId'];
            if (this.id) {  //copy from existing Assay
              this.titleService.setTitle(`Register In-vitro Pharmacology from Copy ` + this.id);
              this.title = 'Register New In-vitro Pharmacology Assay from Copy Assay Id ' + this.id;
              // Do Something. Will Implement Later
            }
          }
          // Import JSON and register New Assay
          else if (this.activatedRoute.snapshot.queryParams['action']) {
            let actionParam = this.activatedRoute.snapshot.queryParams['action'];
            if (actionParam && actionParam === 'import' && window.history.state) {
              this.titleService.setTitle(`Register New In-vitro Pharamcology Assay from Import`);
              this.title = 'Register In-vitro Pharamcology Assay from Import';
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
          }
          // Register New Assay
          else {
            this.title = 'Register New In-vitro Pharmacology Assay Only';
            setTimeout(() => {
              this.titleService.setTitle(`Register In-vitro Pharmacology Assay Only`);

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

  /*
  getVocabularies(): void {
    this.cvService.getDomainVocabulary('INVITRO_ASSAY_SET').subscribe(response => {
      let vocabulary = response['INVITRO_ASSAY_SET'].dictionary;
      if (vocabulary !== null) {
        const keys = Object.keys(vocabulary);
        keys.forEach(key => {
          if (key) {
            const setObj: any = {};
            setObj.value = key;
            // setObj.checked = false;
            this.assaySetList.push(setObj);
          }
        })
      }
    }, error => {
    });
  }
  */

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
    // const set = this.existingAssaySetList[indexCheckbox];
    // this.assay.invitroAssaySets.push(set);

    //const checked = this.checkBox.filter(checkbox1 => checkbox1.checked);

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
          this.submissionMessage = 'In-vitro Pharmacology is Valid. Would you like to submit?';
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
      this.router.navigate(['/invitro-pharm/assay/register']);
      this.invitroPharmacologyService.loadAssay();
    }, 5000);
  }

  submit(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);

    // Get Substance UUID for Target Name
    /*
    if (this.assay.targetNameApprovalId) {
      const substanceSubscription = this.generalService.getSubstanceByAnyId(this.assay.targetNameApprovalId).subscribe(response => {
        if (response) {
          this.assay.targetNameSubstanceUuid = response.uuid;
        }
      });
      this.subscriptions.push(substanceSubscription);

    } else if (this.assay.targetName) {
      const subSubscription = this.generalService.getSubstanceByName(this.assay.targetName).subscribe(response => {
        if (response) {
          if (response.content && response.content.length > 0) {
            response.content.forEach(sub => {
              if (sub._name && sub._name === this.assay.targetName) {
                if (sub.uuid) {
                  this.assay.targetNameSubstanceUuid = sub.uuid;
                }
              }
            });
          }
        }
      });
      this.subscriptions.push(subSubscription);
    }
    */

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

  nameSearch(event: any, fieldName: string, indexRow?: number): void {
    // Get Ingredient Name from the Substance Search Textbox (Type Ahead)
    const ingredientName = event;

    // Assign Substance/Ingredient name to either Target Name, Human Homolog Target, or Ligand/Substrate
    if (fieldName && fieldName === this.TARGET_NAME) {
      //clear existing values
      this.assay.targetNameApprovalId = '';
      this.assay.targetNameSubstanceKey = '';
      this.assay.targetName = ingredientName;

    } else if (fieldName === this.HUMAN_HOMOLOG_TARGET) {
      this.assay.humanHomologTargetApprovalId = '';
      this.assay.humanHomologTargetSubstanceKey = '';
      this.assay.humanHomologTarget = ingredientName;

    } else if (fieldName === this.LIGAND_SUBSTRATE) {
      this.assay.ligandSubstrateApprovalId = '';
      this.assay.ligandSubstrateSubstanceKey = '';
      this.assay.ligandSubstrate = ingredientName;

    } else if (fieldName === this.ANALYTE) {
      this.assay.invitroAssayAnalytes[indexRow].analyteSubstanceKey = '';
      this.assay.invitroAssayAnalytes[indexRow].analyte = ingredientName;
    }

    // Get Substance record by Ingredient/Substance Name, to get Substance UUID and Approval ID
    const substanceSubscribe = this.generalService.getSubstanceByName(ingredientName).subscribe(response => {
      if (response) {
        if (response.content && response.content.length > 0) {

          // Loop through the search results and if the Substance/Ingredient name is same as name in the search
          // result, select that substance
          response.content.forEach(substance => {

            if (substance) {
              if (substance._name) {

                // If Substance Name is same as in the Search Result
                if (substance._name === ingredientName) {

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
                  /* SUBSTANCE KEY RESOLVER END */

                } // if substance._name === ingredientName

              } // if substance._name is not null
            } // if Substance exists

          });  // LOOP Substance search result

        } // if response content > 0
      } // if response
    });
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

    const idHolders = defiant.json.search(old, '//*[id]');
    for (let i = 0; i < idHolders.length; i++) {
      if (idHolders[i].id) {
        delete idHolders[i].id;
      }
    }

    const assayIdHolders = defiant.json.search(old, '//*[assayId]');
    for (let i = 0; i < assayIdHolders.length; i++) {
      if (assayIdHolders[i].assayId) {
        delete assayIdHolders[i].assayId;
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
    //delete old['externalAssaySource'];
    //delete old['externalAssayId'];
    delete old['$$update'];
    delete old['_self'];

    return old;
  }

}
