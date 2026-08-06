import { Component, ViewChild, TemplateRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from "@angular/common/http";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { DatePipe, formatDate } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { take, map, finalize } from 'rxjs/operators';
import { forkJoin, from, tap, of, toArray, concatMap, catchError, throwError } from 'rxjs';
import * as moment from 'moment';
import lodashClone from 'lodash/clone';
import lodashCloneDeep from 'lodash/cloneDeep';
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
import {
  InvitroAssayInformation, InvitroReference, InvitroLaboratory, InvitroSponsor, InvitroSponsorReport,
  InvitroTestAgent, InvitroSponsorSubmitter, InvitroControl, InvitroAssayResult, InvitroAssayScreening, ValidationMessage, InvitroAssayResultInformation
} from '../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-screening-data-import',
  templateUrl: './invitro-pharmacology-screening-data-import.component.html',
  styleUrls: ['./invitro-pharmacology-screening-data-import.component.scss'],
  standalone: false
})

export class InvitroPharmacologyScreeningDataImportComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('progressDialogTemplate') progressDialogTemplateRef: TemplateRef<any>;

  private TEST_AGENT = "Test Agent";

  private subscriptions: Array<Subscription> = [];

  invtroReferences: Array<InvitroReference> = [];

  invitroReference: InvitroReference = {};
  invitroLaboratory: InvitroLaboratory = {};
  invitroSponsor: InvitroSponsor = {};
  invitroSponsorSubmitter: InvitroSponsorSubmitter = {};
  invitroSponsorReport: InvitroSponsorReport = { invitroSponsorSubmitters: [{}] };
  invitroTestAgent: InvitroTestAgent = {}

  invitroAssayScreenings: Array<InvitroAssayScreening> = [];
  invitroAssayFoundInDatabase: Array<InvitroAssayInformation> = [];
  assayToSave: Array<InvitroAssayInformation> = [];

  invitroControlsTemp: Array<any> = [];
  invitroResultsTemp: Array<any> = [];
  invitroAssayResult: InvitroAssayResult = {};
  invitroResultInfo: InvitroAssayResultInformation = {}
  firstAssayRemainingScreening: Array<InvitroAssayScreening> = [];

  requiredFieldMissingArray: Array<any> = [];
  importDataList: Array<any> = [];
  importedBulkAssayJson: Array<InvitroAssayInformation> = [{}];
  savedResultInfo: any = null;

  assayToSaveAllList: Array<any> = [];
  assayToSaveList: Array<any> = [];

  importedAssayJson: any;
  currentDialogData: any;

  message = '';
  submitMessage = '';
  resultMessage = '';
  disableValidateButton = "true";
  disableImportButton = "true";

  isExcelDataLoaded = false;
  canUpdate: boolean = false;

  /* Save Progress Bar variables */
  progressMessage: string = 'Initializing...';
  savedCount: number = 0;
  totalAssays: number = 0;
  isComplete: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
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

  async ngOnInit() {
    this.initializeRequiredFieldArray();

    this.titleService.setTitle("IVP Import Screening Data");

    this.canUpdate = await this.authService.hasSpecificPrivilege('Edit');

  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  onFileChange(evt) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length > 1) {
      alert('Multiple files are not allowed');
      return;
    } else {
      // Empty the list
      this.importDataList.length = 0;
      //requiredFieldMissingArray = [{}];

      this.initializeRequiredFieldArray();

      // Assign FileReader
      const reader: FileReader = new FileReader();

      // Read the Excel file
      reader.onload = (e: any) => {

        const excelFileData: string = e.target.result;

        // Load Excel File data into the WorkBook object
        const workbook: XLSX.WorkBook = XLSX.read(excelFileData, {
          type: 'binary', cellDates: true,
          cellNF: true
        });

        this.getInvitroReference(workbook);

        this.getInvitroLaboratory(workbook);

        this.getInvitroSponsor(workbook);

        this.getInvitroSponsorReport(workbook);

        this.getInvitroSponsorSubmitters(workbook);

        this.getInvitroTestAgent(workbook);

        this.getInvitroBatchNumber(workbook);

        this.getInvitroControls(workbook);

        this.getInvitroResults(workbook);

      } // reader.onload

      reader.readAsBinaryString(target.files[0]);

    } // else single file selected

  }

  initializeRequiredFieldArray() {
    this.requiredFieldMissingArray = [{}];

    this.requiredFieldMissingArray[0].sourceType = false;
    this.requiredFieldMissingArray[0].controlExternalAssaySource = false;

  }
  getInvitroReference(workbook: XLSX.WorkBook) {
    // Read the Second Excel Spreadsheet, the worksheet index starts with 0.
    // Read Sheet "1. Reference and Laboratory"
    const worksheetName = workbook.SheetNames[1];
    const worksheetRefLab: XLSX.WorkSheet = workbook.Sheets[worksheetName];

    // Read Range in Sheet 2, Read the Key to create JSON object
    var range = { s: { r: 0, c: 0 }, e: { r: 5, c: 0 } }; // A1:A5

    // Loop through the range
    for (var R = range.s.r; R <= range.e.r; ++R) {
      for (var C = range.s.c; C <= range.e.c; ++C) {

        var cell_address = { r: R, c: C };

        // Read cell
        var cellKey = XLSX.utils.encode_cell(cell_address);

        // No data found in the cell object
        if (!worksheetRefLab[cellKey]) {
          // do something here
        } else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          // JSON.stringify(worksheetRefLab[cellKeyValue])
          // Cell object returns something like this: {"t":"s","v":"ABCD","r":"<t>ABCD</t>","h":"ABCD","w":"ABCD"}

          if (worksheetRefLab[cellKey].v) {
            if (worksheetRefLab[cellKey].v.trim() === 'Reference Source Type *') {
              this.invitroReference.sourceType = this.getValue(worksheetRefLab[cellKeyValue]);

              // ** Validate Required field
              if (!this.invitroReference.sourceType) {
                this.requiredFieldMissingArray[0].sourceType = true;
              }
            } else if (worksheetRefLab[cellKey].v.trim() === 'Reference Source/Citation *') {
              this.invitroReference.sourceCitation = this.getValue(worksheetRefLab[cellKeyValue]);

              // ** Validate Required field
              if (!this.invitroReference.sourceCitation) {
                this.requiredFieldMissingArray[0].sourceCitation = true;
              }
            } else if (worksheetRefLab[cellKey].v.trim() === 'Reference Source Id') {
              this.invitroReference.sourceId = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Reference Digital Object Identifier') {
              this.invitroReference.digitalObjectIdentifier = this.getValue(worksheetRefLab[cellKeyValue]);
            }

          } // if value is not null

        } // else

      } // for loop Column
    } // for loop Row

    if (this.invitroReference) {
      this.invitroReference.primaryReference = true;
      this.invtroReferences.push(this.invitroReference);
    }

  }

  getInvitroLaboratory(workbook: XLSX.WorkBook) {
    // Read the Second Excel Spreadsheet, the worksheet index starts with 0.
    // Read Sheet "1. Reference and Laboratory"
    const worksheetName = workbook.SheetNames[1];
    const worksheetRefLab: XLSX.WorkSheet = workbook.Sheets[worksheetName];

    // Read Range in Sheet 2, Read the Key to create JSON object
    var range = { s: { r: 6, c: 0 }, e: { r: 15, c: 0 } }; // A7:A16

    // Loop through the range
    for (var R = range.s.r; R <= range.e.r; ++R) {
      for (var C = range.s.c; C <= range.e.c; ++C) {

        var cell_address = { r: R, c: C };

        // Read cell
        var cellKey = XLSX.utils.encode_cell(cell_address);

        // No data found in the cell object
        if (!worksheetRefLab[cellKey]) {
          // do something here
        } else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          if (worksheetRefLab[cellKey].v) {
            if (worksheetRefLab[cellKey].v.trim() === 'Laboratory Name *') {
              this.invitroLaboratory.laboratoryName = this.getValue(worksheetRefLab[cellKeyValue]);

              // ** Validate Required field
              if (!this.invitroLaboratory.laboratoryName) {
                this.requiredFieldMissingArray[0].laboratoryName = true;
              }
            } else if (worksheetRefLab[cellKey].v.trim() === 'Laboratory Affiliation') {
              this.invitroLaboratory.laboratoryAffiliation = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Laboratory Type') {
              this.invitroLaboratory.laboratoryType = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Laboratory Street Address') {
              this.invitroLaboratory.laboratoryStreetAddress = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Laboratory City') {
              this.invitroLaboratory.laboratoryCity = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Laboratory State') {
              this.invitroLaboratory.laboratoryState = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Laboratory Zipcode') {
              this.invitroLaboratory.laboratoryZipcode = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Laboratory Country') {
              this.invitroLaboratory.laboratoryCountry = this.getValue(worksheetRefLab[cellKeyValue]);
            }
          } // if value is not null
        } // else

      } // for loop Column
    } // for loop Row

  }

  getInvitroSponsor(workbook: XLSX.WorkBook) {
    // Read the Third Excel Spreadsheet, the worksheet index starts with 0.
    // Read Sheet "2. Sponsor,Submitter,Report"
    const worksheetName = workbook.SheetNames[2];
    const worksheetRefLab: XLSX.WorkSheet = workbook.Sheets[worksheetName];

    // Read Range A1:A8 in Sheet 3, Read the Key to create JSON object
    var range = { s: { r: 0, c: 0 }, e: { r: 7, c: 0 } }; // A1:A8

    // Loop through the range
    for (var R = range.s.r; R <= range.e.r; ++R) {
      for (var C = range.s.c; C <= range.e.c; ++C) {

        var cell_address = { r: R, c: C };

        // Read cell
        var cellKey = XLSX.utils.encode_cell(cell_address);

        // No data found in the cell object
        if (!worksheetRefLab[cellKey]) {
          // do something here
        } else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          if (worksheetRefLab[cellKey].v) {
            if (worksheetRefLab[cellKey].v.trim() === 'Sponsor Contact Name *') {
              this.invitroSponsor.sponsorContactName = this.getValue(worksheetRefLab[cellKeyValue]);

              // ** Validate Required field
              if (!this.invitroSponsor.sponsorContactName) {
                this.requiredFieldMissingArray[0].sponsorContactName = true;
              }
            } else if (worksheetRefLab[cellKey].v.trim() === 'Sponsor Affiliation') {
              this.invitroSponsor.sponsorAffiliation = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Sponsor Street Address') {
              this.invitroSponsor.sponsorStreetAddress = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Sponsor City') {
              this.invitroSponsor.sponsorCity = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Sponsor State') {
              this.invitroSponsor.sponsorState = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Sponsor Zipcode') {
              this.invitroSponsor.sponsorZipcode = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Sponsor Country') {
              this.invitroSponsor.sponsorCountry = this.getValue(worksheetRefLab[cellKeyValue]);
            }
          } // if value is not null
        } // else

      } // for loop Column
    } // for loop Row

  }

  getInvitroSponsorSubmitters(workbook: XLSX.WorkBook) {
    // Read the Third Excel Spreadsheet, the worksheet index starts with 0.
    // Read Sheet "2.Sponsor,Submitter,Report"
    const worksheetName = workbook.SheetNames[2];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheetName];

    // Read Range A12:A17, Read the Key to create JSON object
    var range = { s: { r: 11, c: 0 }, e: { r: 16, c: 0 } }; // A12:A17

    // Loop through the range
    for (var R = range.s.r; R <= range.e.r; ++R) {

      for (var C = range.s.c; C <= range.e.c; ++C) {

        var cell_address = { r: R, c: C };

        // Read cell
        var cellKey = XLSX.utils.encode_cell(cell_address);

        // No data found in the cell object
        if (!worksheet[cellKey]) {
          // do something here
        } else { // Key found in the cell

          this.invitroSponsorSubmitter = this.invitroSponsorReport.invitroSponsorSubmitters[0];
          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          // if Key exists
          if (worksheet[cellKey].v) {

            if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Name *') {
              this.invitroSponsorSubmitter.sponsorReportSubmitterName = this.getValue(worksheet[cellKeyValue]);

              // ** Validate Required field
              if (!this.invitroSponsorSubmitter.sponsorReportSubmitterName) {
                this.requiredFieldMissingArray[0].sponsorReportSubmitterName = true;
              }
            } else if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Title') {
              this.invitroSponsorSubmitter.sponsorReportSubmitterTitle = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Affiliation') {
              this.invitroSponsorSubmitter.sponsorReportSubmitterAffiliation = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Email') {
              this.invitroSponsorSubmitter.sponsorReportSubmitterEmail = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Phone Number') {
              this.invitroSponsorSubmitter.sponsorReportSubmitterPhoneNumber = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Bioassay Type') {
              this.invitroSponsorSubmitter.sponsorReportSubmitterAssayType = this.getValue(worksheet[cellKeyValue]);
            }
          } // if value is not null

        } // else

      } // for loop Column

    } // for loop Row
  }

  getInvitroSponsorReport(workbook: XLSX.WorkBook) {
    // Read the Third Excel Spreadsheet, the worksheet index starts with 0.
    // Read Sheet "2. Sponsor,Submitter,Report"
    const worksheetName = workbook.SheetNames[2];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheetName];

    // Read Range A21:A22 in Sheet 3, Read the Key to create JSON object
    var rangeRefLab = { s: { r: 20, c: 0 }, e: { r: 21, c: 0 } }; // A21:A22

    // Loop through the range
    for (var R = rangeRefLab.s.r; R <= rangeRefLab.e.r; ++R) {
      for (var C = rangeRefLab.s.c; C <= rangeRefLab.e.c; ++C) {

        var cell_address = { r: R, c: C };

        // Read cell
        var cellKey = XLSX.utils.encode_cell(cell_address);

        // No data found in the cell object
        if (!worksheet[cellKey]) {
          // do something here
        } else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          if (worksheet[cellKey].v) {
            if (worksheet[cellKey].v.trim() === 'Report Number *') {
              this.invitroSponsorReport.reportNumber = this.getValue(worksheet[cellKeyValue]);

              // ** Validate Required field
              if (!this.invitroSponsorReport.reportNumber) {
                this.requiredFieldMissingArray[0].reportNumber = true;
              }
            } else if (worksheet[cellKey].v.trim() === 'Report Date') {
              // Convert Report Date from Number to Date datatype
              if (this.getValue(worksheet[cellKeyValue])) {
                const parsedReportDate: Date = new Date(this.getValue(worksheet[cellKeyValue]));
                let reportDate = moment(parsedReportDate).format('MM/DD/yyyy');

                this.invitroSponsorReport.reportDate = reportDate;
              }
            }
          } // if value is not null
        } // else

      } // for loop Column
    } // for loop Row

  }

  getInvitroTestAgent(workbook: XLSX.WorkBook) {
    // Read the Fourth Excel Spreadsheet, the worksheet index starts with 0.
    // Read Sheet "3. Test Agent,Batch Number"
    const worksheetName = workbook.SheetNames[3];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheetName];

    // Read Range A2:A7 in Sheet 3, Read the Key to create JSON object
    var rangeRefLab = { s: { r: 1, c: 0 }, e: { r: 6, c: 0 } }; // A2:A7

    // Loop through the range
    for (var R = rangeRefLab.s.r; R <= rangeRefLab.e.r; ++R) {
      for (var C = rangeRefLab.s.c; C <= rangeRefLab.e.c; ++C) {

        var cell_address = { r: R, c: C };

        // Read cell
        var cellKey = XLSX.utils.encode_cell(cell_address);

        // No data found in the cell object
        if (!worksheet[cellKey]) {
          // do something here
        } else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          if (worksheet[cellKey].v) {
            if (worksheet[cellKey].v.trim() === 'Test Agent ID (Company Code)') {
              this.invitroTestAgent.testAgentCompanyCode = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Test Agent Name  (FDA) *') {
              this.invitroTestAgent.testAgent = this.getValue(worksheet[cellKeyValue]);

              // ** Validate Required field
              if (!this.invitroTestAgent.testAgent) {
                this.requiredFieldMissingArray[0].testAgent = true;
              }
            } else if (worksheet[cellKey].v.trim() === 'Test Agent Approval ID/UNII') {
              this.invitroTestAgent.testAgentApprovalId = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Test Agent CAS Number') {
              this.invitroTestAgent.casRegistryNumber = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Active Moiety') {
              this.invitroTestAgent.activeMoiety = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Active Moiety Approval ID/UNII') {
              this.invitroTestAgent.activeMoietyApprovalId = this.getValue(worksheet[cellKeyValue]);
            }
          } // if value is not null
        } // else

      } // for loop Column
    } // for loop Row

    if (this.invitroTestAgent.testAgent) {
      this.getSubstanceByNameExactMatch(this.invitroTestAgent.testAgent);
    }
  }

  getInvitroBatchNumber(workbook: XLSX.WorkBook) {
    // Read the Fourth Excel Spreadsheet, the worksheet index starts with 0.
    // Read Sheet "3. Test Agent,Batch Number"
    const worksheetName = workbook.SheetNames[3];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheetName];

    // Read Range in Sheet 3, Read the Key to create JSON object
    var rangeRefLab = { s: { r: 10, c: 0 }, e: { r: 10, c: 0 } }; // A11:A11

    // Loop through the range
    for (var R = rangeRefLab.s.r; R <= rangeRefLab.e.r; ++R) {
      for (var C = rangeRefLab.s.c; C <= rangeRefLab.e.c; ++C) {

        var cell_address = { r: R, c: C };

        // Read cell
        var cellKey = XLSX.utils.encode_cell(cell_address);

        // No data found in the cell object
        if (!worksheet[cellKey]) {
          // do something here
        } else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          if (worksheet[cellKey].v) {
            if (worksheet[cellKey].v.trim() === 'Batch Number *') {
              this.invitroResultInfo.batchNumber = this.getValue(worksheet[cellKeyValue]);

              // ** Validate Required field
              if (!this.invitroResultInfo.batchNumber) {
                this.requiredFieldMissingArray[0].batchNumber = true;
              }
            }
          } // if value is not null
        } // else

      } // for loop Column
    } // for loop Row

  }

  getInvitroControls(workbook: XLSX.WorkBook) {
    // Read the Second Excel Spreadsheet, the worksheet index starts with 0.
    // Read Sheet "4. Assay Controls"
    const worksheetName = workbook.SheetNames[4];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheetName];

    // If header is specified, the first row is considered a data row; if header is not specified,
    // the first row is the header row and not considered data.
    // Null values are returned when raw is true but are skipped when false.
    this.invitroControlsTemp = (XLSX.utils.sheet_to_json(worksheet, { raw: true }));

    this.invitroControlsTemp.forEach((element, index) => {
      if (element) {
        element["externalAssaySource"] = this.replaceUndefinedValue(element["External Assay Source *"]);
        element["externalAssayId"] = this.replaceUndefinedValue(element["External Assay ID *"]);
        element["assayId"] = this.replaceUndefinedValue(element["Assay ID"]);
        element["control"] = this.replaceUndefinedValue(element["Control Substance *"]);
        element["controlApprovalId"] = this.replaceUndefinedValue(element["Control Substance Approval ID"]);
        element["controlType"] = this.replaceUndefinedValue(element["Type of Control"]);
        element["controlResultType"] = this.replaceUndefinedValue(element["Control Result Type"]);
        element["controlReferenceValue"] = this.replaceUndefinedValue(element["Control Reference Value"]);
        element["controlReferenceValueUnits"] = this.replaceUndefinedValue(element["Control Reference Value Units"]);

        // Delete Excel Object key
        delete element["External Assay Source *"];
        delete element["External Assay ID *"];
        delete element["Assay ID"];
        delete element["Control Substance *"];
        delete element["Control Substance Approval ID"];
        delete element["Type of Control"];
        delete element["Control Result Type"];
        delete element["Control Reference Value"];
        delete element["Control Reference Value Units"];

        // create a row if it is empty
        if (this.requiredFieldMissingArray[index] == null) {
          this.requiredFieldMissingArray[index] = {};
        }

        // ** Validate Required field
        if (!element["externalAssaySource"]) {
          this.requiredFieldMissingArray[index].controlExternalAssaySource = true;
        }
        if (!element["externalAssayId"]) {
          this.requiredFieldMissingArray[index].controlExternalAssayId = true;
        }
      }

    });
  }

  getInvitroResults(workbook: XLSX.WorkBook) {
    // Read the Second Excel Spreadsheet, the worksheet index starts with 0.
    // Read Sheet "5. Assay Results"
    const worksheetName = workbook.SheetNames[5];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheetName];

    // If header is specified, the first row is considered a data row; if header is not specified,
    // the first row is the header row and not considered data.
    // Null values are returned when raw is true but are skipped when false.
    this.invitroResultsTemp = (XLSX.utils.sheet_to_json(worksheet, { raw: true }));

    this.invitroResultsTemp.forEach((element, index) => {
      if (element) {
        element["assaySet"] = this.replaceUndefinedValue(element["Assay Set"]);
        element["externalAssaySource"] = this.replaceUndefinedValue(element["External Assay Source *"]);
        element["externalAssayId"] = this.replaceUndefinedValue(element["External Assay ID *"]);
        element["assayId"] = this.replaceUndefinedValue(element["Assay ID"]);
        let testDateNum = this.replaceUndefinedValue(element["Test Date (mm/dd/yyyy)"]);
        element["testAgentConcentration"] = this.replaceUndefinedValue(element["Test Agent Concentration"]);
        element["testAgentConcentrationUnits"] = this.replaceUndefinedValue(element["Test Agent Concentration Units"]);
        element["resultValue"] = this.replaceUndefinedValue(element["Result Value (Average)"]);
        element["resultValueUnits"] = this.replaceUndefinedValue(element["Result Value Units"]);
        element["ligandSubstrateConcentration"] = this.replaceUndefinedValue(element["Ligand/Substrate Concentration"]);
        element["ligandSubstrateConcentrationUnits"] = this.replaceUndefinedValue(element["Ligand/Substrate Concentration Units"]);
        element["plasmaProteinAdded"] = this.replaceUndefinedValue(element["Plasma Protein Added?"]);
        element["protein"] = this.replaceUndefinedValue(element["Protein"]);
        element["plasmaProteinConcentration"] = this.replaceUndefinedValue(element["Plasma Protein Concentration"]);
        element["plasmaProteinConcentrationUnits"] = this.replaceUndefinedValue(element["Plasma Protein Concentration Units"]);
        element["dataType"] = this.replaceUndefinedValue(element["Type of Data"]);
        element["numberOfTests"] = this.replaceUndefinedValue(element["Number of Tests"]);
        element["comments"] = this.replaceUndefinedValue(element["Comments"]);
        element["assayMeasurement"] = this.replaceUndefinedValue(element["Measurements"]);

        // Convert testDate from Number to Date datatype
        if (testDateNum) {
          const parsedTestDate: Date = new Date(testDateNum);
          let testDate = moment(parsedTestDate).format('MM/DD/yyyy');

          element["testDate"] = testDate;
        }

        // Convert Plasma Protein Added from "YES" or "NO" to boolean true and false
        if (element["plasmaProteinAdded"]) {
          if (element["plasmaProteinAdded"] === "YES") {
            element["plasmaProteinAdded"] = true;
          } else if (element["plasmaProteinAdded"] === "NO") {
            element["plasmaProteinAdded"] = false;
          }
        }

        // create a row if it is empty
        if (this.requiredFieldMissingArray[index] == null) {
          this.requiredFieldMissingArray[index] = {};
        }
        // ** Validate Required field
        if (!element["externalAssaySource"]) {
          this.requiredFieldMissingArray[index].resultExternalAssaySource = true;
        }
        if (!element["externalAssayId"]) {
          this.requiredFieldMissingArray[index].resultExternalAssayId = true;
        }

        // Delete Excel Object key
        delete element["Assay Set"];
        delete element["External Assay Source *"];
        delete element["External Assay ID *"];
        delete element["Measurements"];
        delete element["Assay ID"];
        delete element["Test Date (mm/dd/yyyy)"];
        delete element["Test Agent Concentration"];
        delete element["Test Agent Concentration Units"];
        delete element["Result Value (Average)"];
        delete element["Result Value IC50"];
        delete element["Result Value Units"];
        delete element["Ligand/Substrate Concentration"];
        delete element["Ligand/Substrate Concentration Units"];
        delete element["Plasma Protein Added?"];
        delete element["Protein"];
        delete element["Plasma Protein Concentration"];
        delete element["Plasma Protein Concentration Units"];
        delete element["Type of Data"];
        delete element["Number of Tests"];
        delete element["Comments"];
        delete element["External Assay URL/Document Link"];
      }

    });

    // Only enable validate button if there are records in the Excel file
    if (this.invitroResultsTemp && this.invitroResultsTemp.length > 0) {
      this.disableValidateButton = 'false';
    } else {
      this.submitMessage = "Excel file does not contain any data. Please add data and try again.";
    }
  }

  getValue(object: any): string {
    // Return value if the Object is not null
    if (object) {
      return (object.v === undefined || object.v == null || object.v.length <= 0) ? "" : object.v;
    }
  }

  replaceUndefinedValue(value: string): string {
    return (value === undefined || value == null || value.length <= 0) ? "" : value;
  }

  createInvitroReference(object: any): any {
    let tempObject = lodashCloneDeep(object);

    // Delete the keys that not needed
    delete tempObject.externalAssaySource;
    delete tempObject.externalAssayId;
    delete tempObject.externalAssayUrl;
    delete tempObject.assayId;
    delete tempObject.assayFoundInDb;

    let newObject: InvitroReference = {};
    newObject = tempObject;

    return newObject;
  }

  createNewInvitroControl(resultObject: any): any {
    let invitroControls: Array<InvitroControl> = [];

    let tempResultObject = lodashCloneDeep(resultObject);

    // CONTROL ASSAY CHECK, check if Result Assays match control Assays
    this.invitroControlsTemp.forEach(ctrl => {
      if (ctrl) {
        if ((ctrl.externalAssaySource) && (ctrl.externalAssayId)) {
          // if Result and Control Assays match 
          if ((ctrl.externalAssaySource === tempResultObject.externalAssaySource)
            && (ctrl.externalAssayId === tempResultObject.externalAssayId)) {
            let tempObject = lodashCloneDeep(ctrl);

            // Delete the keys that not needed
            delete tempObject.externalAssaySource;
            delete tempObject.externalAssayId;
            delete tempObject.assayId;
            delete tempObject.assayFoundInDb;

            // Create new control object
            let newObject: InvitroControl = {};
            newObject = tempObject;

            invitroControls.push(newObject);
          }
        }
      } // if control object exists
    }); // control loop

    return invitroControls;
  }

  createInvitroResult(object: any): any {
    let tempObject = lodashCloneDeep(object);

    // Delete the keys that not needed
    delete tempObject.externalAssaySource;
    delete tempObject.externalAssayId;
    delete tempObject.externalAssayUrl;
    delete tempObject.assayId;
    delete tempObject.assayFoundInDb;

    let newObject: InvitroAssayResult = {};
    newObject = tempObject;

    return newObject;
  }

  createNewScreeningData(assay: InvitroAssayInformation, resultElement: any, index?: number) {
    // This object will now carry the Assay and new Screening Results and Controls.
    let newAssayToSave = {
      assay: null as InvitroAssayInformation | null,
      newScreening: null as InvitroAssayScreening
    };

    // Create new screening object
    const screening: InvitroAssayScreening = {};

    const date = new Date();
    let importfilename = "import_screening_" + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    screening.screeningImportFileName = importfilename;
    screening.assaySet = resultElement.assaySet;
    screening.invitroAssayResultInformation = {};

    // Create new Invitro Control and Result
    screening.invitroControls = this.createNewInvitroControl(resultElement);
    screening.invitroAssayResult = this.createInvitroResult(resultElement);

    newAssayToSave.assay = assay;
    newAssayToSave.newScreening = screening;

    this.assayToSaveAllList.push(newAssayToSave);

    // Push screening to Assay
    this.invitroAssayScreenings.push(screening);

  }

  combineAssaysAndScreenings() {
    // Use a Map to store the combined assays, with the assay ID as the key.
    const assayMap = new Map<number, InvitroAssayInformation>();

    // Iterate over each item in the input list.
    for (const currentItem of this.assayToSaveAllList) {
      // Ensure the item and its assay/ID are valid before processing.
      if (!currentItem?.assay?.id) {
        console.warn("Skipping an item with a null or invalid assay/ID.", currentItem);
        continue;
      }

      const assayId = currentItem.assay.id;

      // Check if we have already processed an assay with this ID.
      if (!assayMap.has(assayId)) {
        // If this is the first time seeing this assay ID, create a new entry in the map.
        const newAssay = { ...currentItem.assay };

        // Add the current screening to the new assay if it exists.
        if (currentItem.newScreening) {
          newAssay.invitroAssayScreenings.push(currentItem.newScreening);
        }

        // Add the new, combined assay object to our map.
        assayMap.set(assayId, newAssay);
      } else {
        // If the assay already exists in our map, retrieve it.
        const existingAssay = assayMap.get(assayId)!;

        // Add the new screening to the existing assay's screening list if it exists.
        if (currentItem.newScreening) {
          existingAssay.invitroAssayScreenings?.push(currentItem.newScreening);
        }
      }
    }

    // The map now contains all unique assays with their screenings combined.
    // Convert the values of the map to an array and return it.
    this.assayToSaveList = Array.from(assayMap.values());

  }

  getSubstanceByNameExactMatch(ingredientName: string, fieldName?: string) {
    let found = false;

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
                  if (nameObj && nameObj.name === ingredientName) {

                    found = true;

                    this.invitroTestAgent.testAgentSubstanceUuid = substance.uuid;

                    // let substanceKey = this.generalService.getSubstanceKeyBySubstanceResolver(substance, this.substanceKeyTypeForInvitroPharmacologyConfig);

                    /*     
                    if (fieldName == this.TARGET_NAME) {
                    
                      element["targetNameSubstanceUuid"] = substance.uuid;
                      element["targetNameSubstanceKey"] = substanceKey;
                      element["targetNameSubstanceKeyType"] = this.substanceKeyTypeForInvitroPharmacologyConfig;
                    
                      if ((element["targetNameApprovalId"]) && (element["targetNameApprovalId"] !== substance.approvalID)) {
                        this.setValidationMessage(this.TARGET_NAME + ' Approval ID "' + element["targetNameApprovalId"]  + '" in Excel file does not match with Approval ID "' + substance.approvalID + '" in the database. Please fix in the Excel file and then import again', validationMessages, index);
                      }
                    } 
                    else if (fieldName == this.HUMAN_HOMOLOG_TARGET) {
                      element["humanHomologTargetSubstanceKey"] = substanceKey;
                      element["humanHomologTargetSubstanceKeyType"] = this.substanceKeyTypeForInvitroPharmacologyConfig;
                    
                      if ((element["humanHomologTargetApprovalId"]) && (element["humanHomologTargetApprovalId"] !== substance.approvalID)) {
                        this.setValidationMessage(this.HUMAN_HOMOLOG_TARGET + ' Approval ID "' + element["humanHomologTargetApprovalId"]  + '" in Excel file does not match with Approval ID "' + substance.approvalID + '" in the database. Please fix in the Excel file and then import again', validationMessages, index);
                      }
                    } 
                    else if (fieldName == this.LIGAND_SUBSTRATE) {
                      element["ligandSubstrateSubstanceKey"] = substanceKey;
                      element["ligandSubstrateSubstanceKeyType"] = this.substanceKeyTypeForInvitroPharmacologyConfig;
                    
                      if ((element["ligandSubstrateApprovalId"]) && (element["ligandSubstrateApprovalId"] !== substance.approvalID)) {
                        this.setValidationMessage(this.LIGAND_SUBSTRATE + ' Approval ID "' + element["ligandSubstrateApprovalId"]  + '" in Excel file does not match with Approval ID "' + substance.approvalID + '" in the database. Please fix in the Excel file and then import again', validationMessages, index);
                      }
                    }  */

                  } // if names match
                }); // substance names for loop
              } // if names exist
            } // if substance exists
          } // substances for loop

          /*
          if (found == false) {
            this.setValidationMessage(fieldName + ' "' + ingredientName + '" does not exist in the database. Please register this substance first and then import again', validationMessages, index);
          }
  
          if (fieldName == this.TARGET_NAME) {
            this.targetNameCheckCompleted = true;
          } else if (fieldName == this.HUMAN_HOMOLOG_TARGET) {
            this.humanHomologCheckCompleted = true;
          } else if (fieldName == this.LIGAND_SUBSTRATE) {
            this.ligandCheckCompleted = true;
          }  */

          // Enable Database Import button
          //if ( this.targetNameCheckCompleted &&  this.targetNameCheckCompleted &&  this.targetNameCheckCompleted) {
          //  this.disableImportButton = "false";
          // }

        } // if content > 0
        else {
          // this.setValidationMessage(fieldName + ' "' + ingredientName + '" does not exist in the database. Please register this substance first and then import again', validationMessages, index);
        }
      } // if response 
      else {
        // this.setValidationMessage(fieldName + ' "' + ingredientName + '" does not exist in the database. Please register this substance first and then import again', validationMessages, index);
      }
    }, error => {
      // this.setValidationMessage(fieldName + ' "' + ingredientName + '" does not exist in the database. Please register this substance first and then import again', validationMessages, index);
    }, () => {

    });
    this.subscriptions.push(substanceSubscribe);
  }

  validate() {
    this.assayToSaveAllList = [];
    this.assayToSaveList = [];
    this.firstAssayRemainingScreening = [];
    this.savedResultInfo = null;

    this.resultMessage = 'Checking Assays in the database...';
    this.disableImportButton = 'true';

    // This object will now carry the source, ID, and the cached assay.
    const initialState = {
      lastCheckedSource: '',
      lastCheckedAssayId: '', // ADDED: To store the last checked ID
      cachedAssay: null as InvitroAssayInformation | null
    };

    from(this.invitroResultsTemp).pipe(
      // concatMap ensures each result is processed one by one, in order.
      concatMap((result, index) => {
        // If the result is invalid, skip it.
        if (!result.externalAssaySource || !result.externalAssayId) {
          result.assayFoundInDb = 'false';
          return of({ result, status: 'skipped' });
        }

        // UPDATED: Check if both source AND ID match the last processed item.
        if (
          initialState.lastCheckedSource === result.externalAssaySource &&
          initialState.lastCheckedAssayId === result.externalAssayId &&
          initialState.cachedAssay
        ) {
          // If YES, reuse the cached assay. No database call is needed.
          console.log(`Reusing cached assay for source/ID: ${result.externalAssaySource}/${result.externalAssayId}`);
          result.assayFoundInDb = 'true';

          this.createNewScreeningData(initialState.cachedAssay, result, index);
          return of({ result, status: 'reused' });
        } else {
          // If NO, we must make a new database call.
          console.log(`Fetching new assay for source/ID: ${result.externalAssaySource}/${result.externalAssayId}`);

          // Update the state for the next iteration with the current source and ID.
          initialState.lastCheckedSource = result.externalAssaySource;
          initialState.lastCheckedAssayId = result.externalAssayId; // ADDED: Update the ID in our state

          return this.invitroPharmacologyService.getAssayByExternalAssay(
            result.externalAssaySource,
            result.externalAssayId
          ).pipe(
            map(dbAssay => {
              if (dbAssay) {
                // Assay found: update the result and cache it.
                result.assayFoundInDb = 'true';
                // cached Assay will also have new Screening data
                initialState.cachedAssay = lodashCloneDeep(dbAssay); // Cache the new assay

                this.createNewScreeningData(dbAssay, result);
              } else {
                // Assay not found: update result and clear the cache.
                result.assayFoundInDb = 'false';
                initialState.cachedAssay = null; // Invalidate cache
              }
              return { result, status: 'fetched' };
            }),
            catchError(error => {
              console.log("Import Screening data - error getting Assay", error);
              result.assayFoundInDb = 'Error getting Assay';
              initialState.cachedAssay = null; // Invalidate cache on error
              return of({ result, status: 'error' });
            })
          );
        }
      }),
      // Collect all processed results into a single array.
      toArray()
    ).subscribe(processedResults => {
      // This block executes ONCE after all items have been processed sequentially.
      const allAssaysFound = this.invitroResultsTemp.every(r => r.assayFoundInDb === 'true');

      this.resultMessage = allAssaysFound
        ? 'All assays verified.'
        : 'Some assays were not found or could not be verified. Please review.';

      this.disableImportButton = 'false';
      console.log('Sequential check complete.');
    });
  }

  importAssayJSONIntoDatabase() {
    const dialogRef = this.dialog.open(this.progressDialogTemplateRef, {
      width: '500px',
      disableClose: false // Prevent user from closing it while the process is running,if set to true
    });

    this.combineAssaysAndScreenings();

    this.importFirstScreeningResult();
  }

  importFirstScreeningResult() {
    this.progressMessage = 'Preparing to save assays...';
    let assayApiUrlList: any = [];

    const params = new HttpParams();
    const options = {
      params: params,
      type: "JSON",
      headers: {
        "Content-type": "application/json",
      },
    };

    const url = this.invitroPharmacologyService.apiBaseUrlWithInvitroPharmEntityUrl;

    if (!this.assayToSaveList || this.assayToSaveList.length === 0) {
      console.log('No Assays to save.');
      return;
    }

    if (this.assayToSaveList && this.assayToSaveList.length > 0) {

      // Get First Record from the Array
      let firstAssay = lodashCloneDeep(this.assayToSaveList[0]);

      // Find the index of the first screening to keep.
      if (firstAssay.invitroAssayScreenings && firstAssay.invitroAssayScreenings.length > 0) {
        const indexToKeep = firstAssay.invitroAssayScreenings.findIndex(screening => !screening.id);

        // Check if a screening to keep was found.
        if (indexToKeep > -1) {
          // Keep the first screening without an ID, and remove the rest of screening that do not have Ids.
          this.firstAssayRemainingScreening = firstAssay.invitroAssayScreenings.splice(indexToKeep + 1);
        }

        // For the first assay, attach the full result information object.
        this.invitroResultInfo.invitroReferences = this.invtroReferences;
        this.invitroResultInfo.invitroLaboratory = this.invitroLaboratory;
        this.invitroResultInfo.invitroSponsor = this.invitroSponsor;
        this.invitroResultInfo.invitroSponsorReport = this.invitroSponsorReport;
        this.invitroResultInfo.invitroTestAgent = this.invitroTestAgent;

        firstAssay.invitroAssayScreenings[firstAssay.invitroAssayScreenings.length - 1].invitroAssayResultInformation = this.invitroResultInfo;

        const apiUrl = this.http
          .put<InvitroAssayInformation>(url, firstAssay, options)
          .pipe(
            catchError((error) => {
              throw error;
            }),
          );

        // Rest API Urls for forkJoin
        assayApiUrlList.push(apiUrl);

        let savedCount = 0;

        if (assayApiUrlList && assayApiUrlList.length > 0) {
          // Save Assays into the database
          forkJoin(assayApiUrlList).subscribe(
            (results) => {
              let resultList: any = [];

              resultList = results;

              // return list of array of the result
              resultList.forEach((result) => {
                if (result.id) {

                  this.progressMessage = "Saved 1 of " + this.assayToSaveList.length;

                  savedCount = savedCount + 1;

                  if (result.invitroAssayScreenings && result.invitroAssayScreenings.length > 0) {
                    if (result.invitroAssayScreenings[result.invitroAssayScreenings.length - 1].invitroAssayResultInformation) {
                      if (result.invitroAssayScreenings[result.invitroAssayScreenings.length - 1].invitroAssayResultInformation.id) {
                        this.savedResultInfo = result.invitroAssayScreenings[result.invitroAssayScreenings.length - 1].invitroAssayResultInformation;

                        let newAssay = lodashClone(result);

                        if (this.firstAssayRemainingScreening != null && this.firstAssayRemainingScreening.length > 0) {
                          this.firstAssayRemainingScreening.forEach(screening => {
                            if (screening) {
                              if (!screening.invitroAssayResultInformation || !screening.invitroAssayResultInformation.id) {
                                screening.invitroAssayResultInformation = JSON.parse(JSON.stringify(this.savedResultInfo));
                              }
                              newAssay.invitroAssayScreenings.push(screening);
                            }
                          });

                          this.assayToSaveList[0] = newAssay;

                        } else {
                          // remove the first Assay from the list
                          // Only one screening in First Assay, so remove it from the lists
                          // Removes first item
                          if (this.assayToSaveList && this.assayToSaveList.length > 0) {
                            this.assayToSaveList.shift();
                          }
                        }
                      }
                    }
                  }
                }
              });

              // if all the records are saved, refresh the page
              if (savedCount == assayApiUrlList.length) {

                // Save remaining of Results in this Array and other Arrays
                this.importRemainingScreeingResults();
              }

            },
            (error) => {
              this.errorMessage = "There was a problem importing Assay Results from Excel file to Database";
              this.loadingService.setLoading(false);
              alert("ERROR: Something went wrong importing Assay from Excel file to Database");
            },
          ); // forkJoin
        }
      }
    } // assayToSaveList length > 0
  }

  importRemainingScreeingResults() {

    if (!this.assayToSaveList || this.assayToSaveList.length === 0) {
      console.log('No Assays to save.');
      return;
    }

    // This object will now carry the source, ID, and the cached assay.
    const initialState = {
      lastCheckedSource: '',
      lastCheckedAssayId: '', // ADDED: To store the last checked ID
      cachedAssay: null as InvitroAssayInformation | null
    };

    // This will hold the result information from the first saved assay for final navigation.
    // Initialize state and open the dialog immediately ---
    this.isComplete = false;
    this.isError = false;
    let assayReadyToSave: InvitroAssayInformation;

    // Start the sequential save stream using RxJS ---
    from(this.assayToSaveList).pipe(
      // 'concatMap' ensures each assay is processed one by one, waiting for the previous save to complete.
      concatMap((assayToSave, index) => {

        assayReadyToSave = lodashCloneDeep(assayToSave);

        assayReadyToSave.invitroAssayScreenings.forEach((screening, indexScreening) => {
          if (screening) {
            if (!screening.id) {
              if (!screening.invitroAssayResultInformation || !screening.invitroAssayResultInformation.id) {
                screening.invitroAssayResultInformation = this.savedResultInfo;
              }
            }
          }
        });

        // Set the assay on the service (following your existing stateful pattern).
        this.invitroPharmacologyService.assay = assayReadyToSave;

        // Return the save observable. concatMap will subscribe and wait for it to complete.
        return this.invitroPharmacologyService.saveAssay().pipe(
          // 'tap' is used for side-effects, like updating the UI, without altering the stream.
          tap(savedAssay => {

            // Update the state for the next iteration with the current source and ID.
            initialState.lastCheckedSource = savedAssay.externalAssaySource;
            initialState.lastCheckedAssayId = savedAssay.externalAssayId; // ADDED: Update the ID in our state
            initialState.cachedAssay = lodashCloneDeep(savedAssay); // Cache the new assay

            let savedAssayCount = index + 1;
            if (this.firstAssayRemainingScreening && this.firstAssayRemainingScreening.length > 0) {
              savedAssayCount = index + 2;
            }
            this.progressMessage = "Saved " + savedAssayCount + " of " + this.assayToSaveList.length;
          })
        );  // return
      })
    ).subscribe({
      // 'next' is handled by tap, so this can be empty. It's called after each successful save.
      next: (savedAssay) => { 

        if (savedAssay) {
           this.savedResultInfo = savedAssay.invitroAssayScreenings[savedAssay.invitroAssayScreenings.length - 1].invitroAssayResultInformation;
        }
      },

      // --- C. Handle any error in the stream ---
      error: err => {
        this.isError = true;
        this.errorMessage = err.message || 'An unknown error occurred during the save process.';
        this.progressMessage = 'The import process failed.';
      },

      // --- D. Handle successful completion of the entire stream ---
      complete: () => {
        this.isComplete = true;
        this.progressMessage = 'All Assays have been imported successfully!';

        this.close();
        // Wait for the user to close the completed dialog before navigating.
        // dialogRef.afterClosed().subscribe(() => {
        this.invitroPharmacologyService.bypassUpdateCheck();
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/invitro-pharm/', this.savedResultInfo.id, 'edit']);
        // });
      }
    });
  }

  showJSON(): void {
    const date = new Date();
    let jsonFilename = 'invitro_pharm_bulk_assay_screenings_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    let json: any = {};
    if (this.assayToSave.length > 0) {
      json = this.assayToSave;
    }

    let data = { jsonData: json, jsonFilename: jsonFilename };

    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: data
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  close() {
    this.dialog.closeAll();
  }

  isNumber(str: any): boolean {
    if (str) {
      const num = Number(str);
      const nan = isNaN(num);
      return !nan;
    }
    return false;
  }

  validateDate(dateinput: any): boolean {
    let isValid = true;
    if ((dateinput !== null) && (dateinput.length > 0)) {
      if ((dateinput.length < 8) || (dateinput.length > 10)) {
        return false;
      }
      const split = dateinput.split('/');
      if (split.length !== 3 || (split[0].length < 1 || split[0].length > 2) ||
        (split[1].length < 1 || split[1].length > 2) || split[2].length !== 4) {
        return false;
      }
      if (split.length === 3) {
        const comstring = split[0] + split[1] + split[2];
        for (let i = 0; i < split.length; i++) {
          const valid = this.isNumber(split[i]);
          if (valid === false) {
            isValid = false;
            break;
          }
        }
      }
    }
    return isValid;
  }

  scrub(oldraw: any): any {
    const old = oldraw;

    //delete old['_ownerId'];

    return old;
  }
}
