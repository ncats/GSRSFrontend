import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ControlledVocabularyService } from '../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { GeneralService } from '../../service/general.service';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { StructureImageModalComponent } from '@gsrs-core/structure';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service'
import { InvitroAssayInformation, InvitroAssaySet, InvitroAssayAnalyte, ValidationMessage } from '../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-assay-data-import',
  templateUrl: './invitro-pharmacology-assay-data-import.component.html',
  styleUrls: ['./invitro-pharmacology-assay-data-import.component.scss']
})
export class InvitroPharmacologyAssayDataImportComponent implements OnInit {

  @ViewChild('saveTemplate') saveTemplate: TemplateRef<any>;

  private TARGET_NAME = "Assay Target Name";
  private HUMAN_HOMOLOG_TARGET = "Human Homolog Target";
  private LIGAND_SUBSTRATE = "Ligand/Substrate";

  private overlayContainer: HTMLElement;
  substanceKeyTypeForInvitroPharmacologyConfig = null;

  private subscriptions: Array<Subscription> = [];

  importDataList: Array<any> = [];
  importedBulkAssayJson: Array<InvitroAssayInformation> = [];
  importedAssayJson: any;

  disableValidateButton = "true";
  disableImportButton = "true";

  importValidateMessageArray: Array<any> = [];
  importSaveMessageArray: Array<any> = [];

  isAllRecordValid: boolean;
  isAllRecordValidated = false;
  isAllRecordSaved = false;
  isLoading = false;
  isAdmin = false;

  targetNameCheckCompleted = false;
  humanHomologCheckCompleted = false;
  ligandCheckCompleted = false;

  message = '';
  submitMessage = '';

  errorMessage: string;
  serverError: boolean;
  submissionMessage: string;
  showSubmissionMessages = false;
  validationResult = false;
  validationMessages: Array<ValidationMessage> = [];

  totalRecordSavedInDatabase = 0;

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

  ngOnInit(): void {
    // Check if user has either Admin or Updater role
    this.authService.hasAnyRolesAsync('DataEntry', 'SuperDataEntry', 'Admin').subscribe(response => {
      this.isAdmin = response;
    });

    this.overlayContainer = this.overlayContainerService.getContainerElement();

    this.titleService.setTitle("IVP Import Assay Data");

    // Get Invitro Pharmacology Substance Key Type from the configuration file
    this.substanceKeyTypeForInvitroPharmacologyConfig = this.generalService.getSubstanceKeyTypeForInvitroPharmacologyConfig();

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  onFileChange(evt) {
    // Get Data from Excel File
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length > 1) {
      alert('Multiple files are not allowed');
      return;
    }
    else {
      this.importSaveMessageArray = [];
      this.importValidateMessageArray = [];
      this.disableImportButton = 'true';
      this.isAllRecordValidated = false;
      this.submitMessage = '';

      // Empty the list
      this.importDataList.length = 0;

      // Assign FileReader
      const reader: FileReader = new FileReader();

      // Read the Excel file
      reader.onload = (e: any) => {

        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        // Read the Excel Spreadsheet that has Assay data
        const wsname = wb.SheetNames[1];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        // Read the 'Controlled Vocabularies' sheet 

        // If header is specified, the first row is considered a data row; if header is not specified,
        // the first row is the header row and not considered data.
        // Null values are returned when raw is true but are skipped when false.
        this.importedAssayJson = (XLSX.utils.sheet_to_json(ws, { raw: true }));

        // 23 Fields
        this.importedAssayJson.forEach((element, index) => {
          if (element) {

            // Create Assay Set Object
            this.createAssaySet(element);

            element["assayId"] = this.replaceUndefinedValue(element["Assay ID"]);
            element["externalAssaySource"] = this.replaceUndefinedValue(element["External Assay Source *"]);
            element["externalAssayId"] = this.replaceUndefinedValue(element["External Assay ID *"]);
            element["externalAssayReferenceUrl"] = this.replaceUndefinedValue(element["External Assay Reference URL"]);
            element["assayTitle"] = this.replaceUndefinedValue(element["Assay Title"]);

            element["assayFormat"] = this.replaceUndefinedValue(element["Assay Format"]);
            element["assayMode"] = this.replaceUndefinedValue(element["Assay Mode"]);
            element["bioassayType"] = this.replaceUndefinedValue(element["Bioassay Type"]);
            element["bioassayClass"] = this.replaceUndefinedValue(element["Bioassay Class"]);
            element["studyType"] = this.replaceUndefinedValue(element["Study Type"]);
            element["detectionMethod"] = this.replaceUndefinedValue(element["Detection Method"]);
            element["presentationType"] = this.replaceUndefinedValue(element["Presentation Type"]);
            element["presentation"] = this.replaceUndefinedValue(element["Presentation"]);
            element["publicDomain"] = this.replaceUndefinedValue(element["Public Domain"]);

            element["targetSpecies"] = this.replaceUndefinedValue(element["Target Species"]);
            element["targetName"] = this.replaceUndefinedValue(element["Assay Target Name *"]);
            element["targetNameApprovalId"] = this.replaceUndefinedValue(element["Assay Target Name Approval ID"]);

            element["humanHomologTarget"] = this.replaceUndefinedValue(element["Human Homolog Target Name"]);
            element["humanHomologTargetApprovalId"] = this.replaceUndefinedValue(element["Human homolog Target Name Approval ID"]);

            element["ligandSubstrate"] = this.replaceUndefinedValue(element["Ligand/Substate"]);
            element["ligandSubstrateApprovalId"] = this.replaceUndefinedValue(element["Ligand/Substrate Approval ID"]);

            element["standardLigandSubstrateConcentration"] = this.replaceUndefinedValue(element["Standard Ligand/Substrate Concentration"]);
            element["standardLigandSubstrateConcentrationUnits"] = this.replaceUndefinedValue(element["Standard Ligand/Substrate Concentration Units"]);

            // Create Analytes Object
            this.createAnalytes(element);

            // Delete 25 keys from Excel File. Only want to keep the JSON format Key and remove
            // key with Column formats that have spaces and capitalized
            delete element["Assay Set *"]
            delete element["Assay ID"];
            delete element["External Assay Source *"];
            delete element["External Assay ID *"];
            delete element["External Assay Reference URL"];
            delete element["Assay Title"];
            delete element["Assay Format"];
            delete element["Assay Mode"];
            delete element["Bioassay Type"];
            delete element["Bioassay Class"];

            delete element["Study Type"];
            delete element["Detection Method"];
            delete element["Presentation Type"];
            delete element["Presentation"];
            delete element["Public Domain"];
            delete element["Assay Target Name *"];
            delete element["Assay Target Name Approval ID"];
            delete element["Target Species"];
            delete element["Human Homolog Target Name"];
            delete element["Human homolog Target Name Approval ID"]

            delete element["Ligand/Substate"]
            delete element["Ligand/Substrate Approval ID"]
            delete element["Standard Ligand/Substrate Concentration"]
            delete element["Standard Ligand/Substrate Concentration Units"]

            delete element["Analytes"]

            // Add to list
            this.importDataList.push(element);
          } // element

        }); // LOOP: importedAssayJson

        // Only enable validate button if there are records in the Excel file
        if (this.importedAssayJson.length > 0) {
          this.disableValidateButton = 'false';
        } else {
          this.submitMessage = "Excel file does not contain any data. Please add data and try again.";
        }
      } // reader.onload

      reader.readAsBinaryString(target.files[0]);

    } // else

  }

  replaceUndefinedValue(value): string {
    return (value === undefined || value == null || value.length <= 0) ? "" : value;
  }

  createAssaySet(element: any) {
    const newAssaySet: InvitroAssaySet = {};

    let assaySets: Array<InvitroAssaySet> = [];
    let assaySetFromFile = this.replaceUndefinedValue(element["Assay Set *"]);

    // If multiple Assay Set are separated by pipe | delimter in the Excel file, separate
    // each Assay Set as a separate object
    if (assaySetFromFile) {
      if (assaySetFromFile.includes("|")) {
        let assaySetArray = assaySetFromFile.split("|");
        assaySetArray.forEach(assaySt => {
          if (assaySt) {
            const newAssaySet: InvitroAssaySet = {};

            newAssaySet.assaySet = assaySt;
            assaySets.push(newAssaySet);
          }
        });
      } else {
        newAssaySet.assaySet = assaySetFromFile;
        assaySets.push(newAssaySet);
      }

      element["invitroAssaySets"] = assaySets;
    }
  }

  createAnalytes(element: any) {
    const newAssayAnalyte: InvitroAssayAnalyte = {};

    let analytes: Array<InvitroAssayAnalyte> = [];
    let analytesFromFile = this.replaceUndefinedValue(element["Analytes"]);

    // If multiple Anaytes are separated by pipe | delimter in the Excel file, separate
    // each Analyte as a separate object
    if (analytesFromFile) {
      if (analytesFromFile.includes("|")) {
        let analyteArray = analytesFromFile.split("|");
        analyteArray.forEach(analyte => {
          if (analyte) {
            const newAssayAnalyte: InvitroAssayAnalyte = {};

            newAssayAnalyte.analyte = analyte;
            analytes.push(newAssayAnalyte);
          }
        });
      } else {
        newAssayAnalyte.analyte = analytesFromFile;
        analytes.push(newAssayAnalyte);
      }

      element["invitroAssayAnalytes"] = analytes;
    }
  }

  validate(): void {
    this.serverError = false;
    this.isLoading = true;
    this.loadingService.setLoading(true);

    this.importValidateMessageArray = [];

    // Loop through each Assay JSON Record, and save into the database
    this.importedAssayJson.forEach((element, index) => {

      if (element) {
        let validationMessages: Array<ValidationMessage> = [];

        const assay = JSON.parse(JSON.stringify(element));
        this.invitroPharmacologyService.assay = assay;

        this.submitMessage = 'Validating Assay records in Excel file ' + (index + 1) + ' of ' + this.importedAssayJson.length + ', please wait .....';


        // Validate Assay
        const validateSubscription = this.invitroPharmacologyService.validateAssay().subscribe(response => {

          // Populated Substance Key and Substance Key Type for Target Name, Homolog, Substrate
          if (element['targetName']) {
            this.getSubstanceNameDetails(element, element['targetName'], this.TARGET_NAME, validationMessages, index);
          }
          if (element['humanHomologTarget']) {
            this.getSubstanceNameDetails(element, element['humanHomologTarget'], this.HUMAN_HOMOLOG_TARGET, validationMessages, index)
          }
          if (element['ligandSubstrate']) {
            this.getSubstanceNameDetails(element, element['ligandSubstrate'], this.LIGAND_SUBSTRATE, validationMessages, index)
          }

          // NEED this two fields to check if valid or not
          let validationMessagesResponse = response.validationMessages.filter(
            message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');

          if (validationMessagesResponse && validationMessagesResponse.length > 0) {
            validationMessagesResponse.forEach(validation => {
              if (validation) {
                validationMessages.push(validation);
              }
            });
          }

          const saved = { 'indexRecord': index, 'invitroAssaySets': assay.invitroAssaySets, 'externalAssaySource': assay.externalAssaySource, 'externalAssayId': assay.externalAssayId, 'targetName': assay.targetName, 'validationMessages': validationMessages, 'valid': response.valid }

          this.importValidateMessageArray.push(saved);

          // All rows in the Excel file has been validated
          if (this.importDataList.length == this.importValidateMessageArray.length) {

            // Get the index if the value exists in the array
            // if index returns -1, all records are Valid
            const indexAllRecordValid = this.importValidateMessageArray.findIndex(record => record.valid === false);

            // Not all records are valid, has ERROR
            if (indexAllRecordValid >= 0) {
              this.isAllRecordValid = false;
            } else {
              // ALL RECORDS VALID
              this.isAllRecordValid = true;
            }

            if (this.isAllRecordValid == true) {
              this.disableImportButton = 'false';
            }

            // SORT the validation array by id
            this.importValidateMessageArray.sort((a, b) => {
              return a.indexRecord - b.indexRecord;
            });

            this.isAllRecordValidated = true;
            this.submitMessage = '';

            this.loadingService.setLoading(false);
            this.isLoading = false;
          }

        }, error => {
          this.addServerError(error);
          this.loadingService.setLoading(false);
          this.isLoading = false;
        });
        this.subscriptions.push(validateSubscription);
      }

    }); // for import data list
  }

  setValidationMessage(message: string, validationMessages: Array<ValidationMessage>, index: number) {
    const validate: ValidationMessage = {};
    validate.message = message;
    validate.messageType = 'ERROR';
    validationMessages.push(validate);

    this.importValidateMessageArray[index].valid = false;

    // Disable Import to Database button
    this.disableImportButton = "true";

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

    // Display error message
    if (this.validationMessages.length > 0) {
      this.submitMessage = "There is an error. " + message.message;
    }
  }

  importAssayJSONIntoDatabase() {
    this.importValidateMessageArray = [];
    this.importSaveMessageArray = [];
    this.isAllRecordSaved = false;
    this.submitMessage = '';

    this.isLoading = true;
    this.loadingService.setLoading(this.isLoading);

    // Loop through each Assay JSON Record, and save into the database
    this.importedAssayJson.forEach((element, index) => {

      setTimeout(() => {
        if (element) {
          this.invitroPharmacologyService.assay = JSON.parse(JSON.stringify(element));

          this.submitMessage = 'Saving Assay records into the database ' + (index + 1) + ' of ' + this.importedAssayJson.length + ', please wait .....';

          // Save Into the database
          const saveSubscription = this.invitroPharmacologyService.saveAssay().subscribe(response => {
            if (response) {
              if (response.id) {

                this.totalRecordSavedInDatabase = index + 1;

                const saved = { 'indexRecord': index, 'assayId': response.assayId, 'externalAssaySource': response.externalAssaySource, 'externalAssayId': response.externalAssayId, 'saved': 'Yes', 'savedId': response.id }
                this.importSaveMessageArray.push(saved);
              }

              // All records saved
              if (index == this.importedAssayJson.length - 1) {
                this.message = "";
                this.submitMessage = "Import Successful";

                // Clear Validation variables
                this.importValidateMessageArray = [];
                this.isAllRecordValid = false;
                this.isAllRecordValidated = false;

                this.disableValidateButton = 'true';
                this.disableImportButton = 'true';

                this.isAllRecordSaved = true;

                // SORT the validation array by id
                this.importSaveMessageArray.sort((a, b) => {
                  return a.indexRecord - b.indexRecord;
                });

                this.isLoading = false;
                this.loadingService.setLoading(this.isLoading);
              }
            }
          }, error => {
            // Error occured during saving
            console.log("ERROR DURING SAVING ASSAY IMPORT " + error)
            const saved = { 'indexRecord': index, 'assayId': element['assayId'], 'externalAssaySource': element['externalAssaySource'], 'externalAssayId': element['externalAssayId'], 'saved': 'No', 'savedId': '', 'error': error }
            this.importSaveMessageArray.push(saved);

            this.submitMessage = "";
            this.isLoading = false;
            this.loadingService.setLoading(this.isLoading);
          }); // save

          this.subscriptions.push(saveSubscription);
        }
      }, 10000);  // timeout
    });

  }

  getSubstanceNameDetails(element: any, ingredientName: string, fieldName: string, validationMessages: Array<ValidationMessage>, index: number) {

    let found = false;

    if (ingredientName) {
      const substanceSubscribe = this.generalService.getSubstanceByNameExactMatch(ingredientName).subscribe(response => {
        if (response) {
          if (response.content && response.content.length > 0) {

            // Loop through the search results and if the Substance/Ingredient name is same as name in the search
            // result, select that substance
            let substances = response.content;
            for (let i = 0; i < substances.length; i++) {
              let substance = substances[i];
              if (substance) {
                if (substance.names && substance.names.length > 0) {

                  substance.names.forEach(nameObj => {
                    if (nameObj && nameObj.name === ingredientName.toUpperCase()) {

                      found = true;

                      let substanceKey = this.generalService.getSubstanceKeyBySubstanceResolver(substance, this.substanceKeyTypeForInvitroPharmacologyConfig);

                      if (fieldName == this.TARGET_NAME) {
                        element["targetNameSubstanceUuid"] = substance.uuid;
                        element["targetNameSubstanceKey"] = substanceKey;
                        element["targetNameSubstanceKeyType"] = this.substanceKeyTypeForInvitroPharmacologyConfig;

                        if (substance.approvalID) {

                        }
                        
                        if ((element["targetNameApprovalId"]) && (element["targetNameApprovalId"] !== substance.approvalID)) {
                          this.setValidationMessage(this.TARGET_NAME + ' Approval ID "' + element["targetNameApprovalId"] + '" in Excel file does not match with Approval ID "' + substance.approvalID + '" for "' + ingredientName + '" in the database. Please fix in the Excel file and then import again', validationMessages, index);
                        }
                      }
                      else if (fieldName == this.HUMAN_HOMOLOG_TARGET) {
                        element["humanHomologTargetSubstanceKey"] = substanceKey;
                        element["humanHomologTargetSubstanceKeyType"] = this.substanceKeyTypeForInvitroPharmacologyConfig;

                        if ((element["humanHomologTargetApprovalId"]) && (element["humanHomologTargetApprovalId"] !== substance.approvalID)) {
                          this.setValidationMessage(this.HUMAN_HOMOLOG_TARGET + ' Approval ID "' + element["humanHomologTargetApprovalId"] + '" in Excel file does not match with Approval ID "' + substance.approvalID + '" for "' + ingredientName + '" in the database. Please fix in the Excel file and then import again', validationMessages, index);
                        }
                      }
                      else if (fieldName == this.LIGAND_SUBSTRATE) {
                        element["ligandSubstrateSubstanceKey"] = substanceKey;
                        element["ligandSubstrateSubstanceKeyType"] = this.substanceKeyTypeForInvitroPharmacologyConfig;

                        if ((element["ligandSubstrateApprovalId"]) && (element["ligandSubstrateApprovalId"] !== substance.approvalID)) {
                          this.setValidationMessage(this.LIGAND_SUBSTRATE + ' Approval ID "' + element["ligandSubstrateApprovalId"] + '" in Excel file does not match with Approval ID "' + substance.approvalID + '" for "' + ingredientName + '" in the database. Please fix in the Excel file and then import again', validationMessages, index);
                        }
                      }
                    }
                  }); // substance names for loop
                } // if names exist
              } // if substance exists
            } // substances for loop

            if (found == false) {
              this.setValidationMessage(fieldName + ' "' + ingredientName + '" does not exist in the database. Please register this substance first and then import again', validationMessages, index);
            }

            if (fieldName == this.TARGET_NAME) {
              this.targetNameCheckCompleted = true;
            } else if (fieldName == this.HUMAN_HOMOLOG_TARGET) {
              this.humanHomologCheckCompleted = true;
            } else if (fieldName == this.LIGAND_SUBSTRATE) {
              this.ligandCheckCompleted = true;
            }

            // Enable Database Import button
            if (this.targetNameCheckCompleted && this.targetNameCheckCompleted && this.targetNameCheckCompleted) {
              //  this.disableImportButton = "false";
            }

          } // if content > 0
          else {
            this.setValidationMessage(fieldName + ' "' + ingredientName + '" does not exist in the database. Please register this substance first and then import again', validationMessages, index);
          }
        } // if response 
        else {
          this.setValidationMessage(fieldName + ' "' + ingredientName + '" does not exist in the database. Please register this substance first and then import again', validationMessages, index);
        }
      }, error => {
        this.setValidationMessage(fieldName + ' "' + ingredientName + '" does not exist in the database. Please register this substance first and then import again', validationMessages, index);
      }, () => {


      });
      this.subscriptions.push(substanceSubscribe);
    }
  }

  showJSON(): void {
    const date = new Date();
    let jsonFilename = 'invitro_pharm_bulk_assays_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    let json: any = {};
    if (this.importedAssayJson !== undefined || this.importedAssayJson != null) {
      json = this.importedAssayJson;
    }

    let data = { jsonData: json, jsonFilename: jsonFilename };

    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: data
    });

    // this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  openModalSave() {
    const dialogRef = this.dialog.open(this.saveTemplate, {
      width: '60%',
      height: '30%'
    });

    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  close() {
    this.dialog.closeAll();
  }
}
