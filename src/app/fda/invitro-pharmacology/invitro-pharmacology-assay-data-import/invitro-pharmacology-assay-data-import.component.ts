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
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service'
import { InvitroAssayInformation, InvitroAssaySet, ValidationMessage } from '../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-assay-data-import',
  templateUrl: './invitro-pharmacology-assay-data-import.component.html',
  styleUrls: ['./invitro-pharmacology-assay-data-import.component.scss']
})
export class InvitroPharmacologyAssayDataImportComponent implements OnInit {

  private TARGET_NAME = "TARGET_NAME";
  private HUMAN_HOMOLOG_TARGET = "HUMAN_HOMOLOG_TARGET";
  private LIGAND_SUBSTRATE = "LIGAND_SUBSTRATE";
  private ANALYTE = "ANALYTE";

  substanceKeyTypeForInvitroPharmacologyConfig = null;

  private subscriptions: Array<Subscription> = [];

  importDataList: Array<any> = [];
  importedBulkAssayJson: Array<InvitroAssayInformation> = [];
  importedAssayJson: any;

  disableValidateButton = "true";
  disableImportButton = "true";

  importValidateMessageArray: Array<any> = [];
  importSaveMessageArray: Array<any> = [];

  willDownload = false;

  isAllRecordValid: boolean;

  isAllRecordValidated = false;
  isAllRecordSaved = false;

  isLoading = false;

  errorMessage: string;
  serverError: boolean;
  submissionMessage: string;
  showSubmissionMessages = false;
  validationResult = false;
  validationMessages: Array<ValidationMessage> = [];
  message = '';
  submitMessage = '';
  isAdmin = false;

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
    this.titleService.setTitle("IVP Import Assay Data");

    // Check if user has either Admin or Updater role
    this.authService.hasAnyRolesAsync('DataEntry', 'SuperDataEntry', 'Admin').subscribe(response => {
      this.isAdmin = response;
    });

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
    /*
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);
      document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
      this.setDownload(dataString);
    }
    reader.readAsBinaryString(file);
    */

    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length > 1) {
      alert('Multiple files are not allowed');
      return;
    }
    else {
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

        // Read the first Excel Spreadsheet
        const wsname = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        // If header is specified, the first row is considered a data row; if header is not specified,
        // the first row is the header row and not considered data.
        // Null values are returned when raw is true but are skipped when false.
        this.importedAssayJson = (XLSX.utils.sheet_to_json(ws, { raw: true }));

        // 23 Fields
        this.importedAssayJson.forEach((element, index) => {
          if (element) {
            element["externalAssaySource"] = this.replaceUndefinedValue(element["External Assay Source"]);
            element["externalAssayId"] = this.replaceUndefinedValue(element["External Assay ID"]);
            element["externalAssayReferenceUrl"] = this.replaceUndefinedValue(element["External Assay Reference URL"]);
            element["assayTitle"] = this.replaceUndefinedValue(element["Assay Title"]);
            element["assayFormat"] = this.replaceUndefinedValue(element["Assay Format"]);
            element["assayMode"] = this.replaceUndefinedValue(element["Assay Mode"]);
            element["bioassayType"] = this.replaceUndefinedValue(element["Bioassay Type"]);
            element["bioassayClass"] = this.replaceUndefinedValue(element["Bioassay Class"]);
            element["studyType"] = this.replaceUndefinedValue(element["Study Type"]);
            element["detectionMethod"] = this.replaceUndefinedValue(element["Detection Method"]);

            element["presentationType"] = this.replaceUndefinedValue(element["Presention Type"]);
            element["presentation"] = this.replaceUndefinedValue(element["Presentation"]);
            element["publicDomain"] = this.replaceUndefinedValue(element["Public Domain"]);
            element["targetName"] = this.replaceUndefinedValue(element["Assay Target Name"]);
            element["targetNameApprovalId"] = this.replaceUndefinedValue(element["Assay Target Name Approval ID"]);
            element["targetSpecies"] = this.replaceUndefinedValue(element["Target Species"]);
            element["humanHomologTarget"] = this.replaceUndefinedValue(element["Human Homolog Target Name"]);
            element["humanHomologTargetApprovalId"] = this.replaceUndefinedValue(element["Human homolog Target Name Approval ID"]);
            element["ligandSubstrate"] = this.replaceUndefinedValue(element["Ligand/Substate"]);
            element["ligandSubstrateApprovalId"] = this.replaceUndefinedValue(element["Ligand/Substrate Approval ID"]);

            element["standardLigandSubstrateConcentration"] = this.replaceUndefinedValue(element["Standard Ligand/Substrate Concentration"]);
            element["standardLigandSubstrateConcentrationUnits"] = this.replaceUndefinedValue(element["Standard Ligand/Substrate Concentration Units"]);

            // Assay Set
            let assaySet = this.replaceUndefinedValue(element["Assay Set"]);
            this.createAssaySet(element);

            // Delete the key. 23 Fields
            delete element["External Assay Source"];
            delete element["External Assay ID"];
            delete element["External Assay Reference URL"];
            delete element["Assay Title"];
            delete element["Assay Format"];
            delete element["Assay Mode"];
            delete element["Bioassay Type"];
            delete element["Bioassay Class"];
            delete element["Study Type"];
            delete element["Detection Method"];

            delete element["Detection Method"];
            delete element["Presention Type"];
            delete element["Presentation"];
            delete element["Public Domain"];
            delete element["Assay Target Name"];
            delete element["Assay Target Name Approval ID"];
            delete element["Target Species"];
            delete element["Human Homolog Target Name"];
            delete element["Human homolog Target Name Approval ID"]
            delete element["Ligand/Substate"]

            delete element["Ligand/Substrate Approval ID"]
            delete element["Standard Ligand/Substrate Concentration"]
            delete element["Standard Ligand/Substrate Concentration Units"]

            // delete element["Assay Set"]

            // Add to list
            this.importDataList.push(element);
          } // element

        }); // LOOP: importedAssayJson

        this.disableValidateButton = 'false';
        // this.disableImportButton = 'false';

      } // reader.onload

      reader.readAsBinaryString(target.files[0]);

    } // else

  }

  replaceUndefinedValue(value): string {
    return (value === undefined || value == null || value.length <= 0) ? "" : value;
  }

  createAssaySet(element: any) {
    const newAssaySet: InvitroAssaySet = {};

    let sets: Array<InvitroAssaySet> = [];
    let assaySet = this.replaceUndefinedValue(element["Assay Set"]);
    newAssaySet.assaySet = assaySet;
    sets.push(newAssaySet);
    element["invitroAssaySets"] = sets;
  }

  validate(): void {
    this.isLoading = true;
    this.serverError = false;
    this.loadingService.setLoading(true);

    this.submitMessage = "Validating Assay records, please wait .....";

    this.importValidateMessageArray = [];
    // Loop through each Assay JSON Record, and save into the database
    this.importedAssayJson.forEach((element, index) => {

      // NEED THIS, otherwise the index value is getting changed before validation comes back
      const localIndex = index;
      // setTimeout(() => {
      if (element) {

        const assay = JSON.parse(JSON.stringify(element));
        this.invitroPharmacologyService.assay = assay;

        // Validate Assay
        this.invitroPharmacologyService.validateAssay().pipe(take(1)).subscribe(results => {
          this.submissionMessage = null;

          // NEED this two fields to check if valid or not
          this.validationMessages = results.validationMessages.filter(
            message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING');
          this.validationResult = results.valid;

          const saved = { 'indexRecord': index, 'externalAssaySource': assay.externalAssaySource, 'externalAssayId': assay.externalAssayId, validationMessages: this.validationMessages, 'valid': results.valid }
          this.importValidateMessageArray.push(saved);

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

            // SORT the validation array by id
            this.importValidateMessageArray.sort((a, b) => {
              return a.indexRecord - b.indexRecord;
            });

            if (this.isAllRecordValid == true) {
              this.disableImportButton = 'false';
            }

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
      }

    }); // for import data list
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

  importAssayJSONIntoDatabase() {
    this.importValidateMessageArray = [];
    this.importSaveMessageArray = [];
    this.isAllRecordSaved = false;
    this.submitMessage = '';

    this.isLoading = true;
    this.loadingService.setLoading(this.isLoading);

    this.submitMessage = "Saving Assay records into the database, please wait .....";

    // Loop through each Assay JSON Record, and save into the database
    this.importedAssayJson.forEach((element, index) => {

      setTimeout(() => {
        if (element) {
          this.invitroPharmacologyService.assay = JSON.parse(JSON.stringify(element));

          // this.populateSubstanceKey(this.invitroPharmacologyService.assay.targetName, this.TARGET_NAME);
          // this.populateSubstanceKey(this.invitroPharmacologyService.assay.targetName, this.TARGET_NAME);
          // this.populateSubstanceKey(this.invitroPharmacologyService.assay.targetName, this.TARGET_NAME);

          // Save Into the database
          this.invitroPharmacologyService.saveAssay().subscribe(response => {
            if (response) {
              if (response.id) {

                const saved = { 'indexRecord': index, 'externalAssaySource': response.externalAssaySource, 'externalAssayId': response.externalAssayId, 'saved': 'Yes', 'savedId': response.id }
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

            this.submitMessage = "";

            this.isLoading = false;
            this.loadingService.setLoading(this.isLoading);
          });
        }
      }, 10000);  // timeout
    });
  }

  populateSubstanceKey(ingredientName: string, fieldName: string) {

    /****************************************************************/
    /* SUBSTANCE KEY RESOLVER BEGIN                                 */
    /****************************************************************/
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
                    // this.assay.targetNameApprovalId = substance.approvalID;
                    // this.assay.targetNameSubstanceKey = substanceKey;
                    //this.assay.targetNameSubstanceKeyType = this.substanceKeyTypeForInvitroPharmacologyConfig;
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

    /* SUBSTANCE KEY RESOLVER END */

  }

  showJSON(): void {
    const date = new Date();
    let jsonFilename = 'invitro_pharm_bulk_assays_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    let json: any = {};
    if (this.importedAssayJson !== undefined || this.importedAssayJson != null) {
      json = this.importedAssayJson;
    }

    let data = {jsonData: json, jsonFilename: jsonFilename};

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

}
