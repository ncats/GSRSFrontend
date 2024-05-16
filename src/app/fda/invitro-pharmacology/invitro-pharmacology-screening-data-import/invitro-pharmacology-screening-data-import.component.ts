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

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service'
import {
  InvitroAssayInformation, InvitroReference, InvitroLaboratory, InvitroSponsor, InvitroSponsorReport,
  InvitroTestAgent, InvitroSponsorSubmitter, InvitroControl, InvitroAssayResult, InvitroAssayScreening, ValidationMessage, InvitroAssayResultInformation
} from '../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-screening-data-import',
  templateUrl: './invitro-pharmacology-screening-data-import.component.html',
  styleUrls: ['./invitro-pharmacology-screening-data-import.component.scss']
})

export class InvitroPharmacologyScreeningDataImportComponent implements OnInit {

  private subscriptions: Array<Subscription> = [];

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

  importDataList: Array<any> = [];
  importedBulkAssayJson: Array<InvitroAssayInformation> = [{}];
  importedAssayJson: any;

  message = '';
  submitMessage = '';
  disableImportButton = "true";
  isExcelDataLoaded = false;
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

    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').pipe(take(1)).subscribe(response => {
      this.isAdmin = response;
    });

    this.titleService.setTitle("IVP Import Screening Data");
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
    }
    else {
      // Empty the list
      this.importDataList.length = 0;

      // Assign FileReader
      const reader: FileReader = new FileReader();

      // Read the Excel file
      reader.onload = (e: any) => {

        const excelFileData: string = e.target.result;

        // Load Excel File data into the WorkBook object
        const workbook: XLSX.WorkBook = XLSX.read(excelFileData, { type: 'binary',  cellDates: true,
        cellNF: true});

        this.readInvitroReference(workbook);

        this.createInvitroLaboratory(workbook);

        this.createInvitroSponsor(workbook);

        this.createInvitroSponsorReport(workbook);

        this.createInvitroSponsorSubmitters(workbook);

        this.createInvitroTestAgent(workbook);

        this.createInvitroBatchNumber(workbook);

        this.createInvitroControls(workbook);

        this.createInvitroResults(workbook);

        // Validate
        this.validateExcelImportData();

      } // reader.onload

      reader.readAsBinaryString(target.files[0]);

    } // else single file selected

  }

  readInvitroReference(workbook: XLSX.WorkBook) {
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
        }
        else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          // JSON.stringify(worksheetRefLab[cellKeyValue])
          // Cell object returns something like this: {"t":"s","v":"ABCD","r":"<t>ABCD</t>","h":"ABCD","w":"ABCD"}

          if (worksheetRefLab[cellKey].v) {
            if (worksheetRefLab[cellKey].v.trim() === 'Reference Source Type *') {
              this.invitroReference.sourceType = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Reference Source/Citation *') {
              this.invitroReference.sourceCitation = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Reference Source Id') {
              this.invitroReference.sourceId = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Reference Digital Object Identifier') {
              this.invitroReference.digitalObjectIdentifier = this.getValue(worksheetRefLab[cellKeyValue]);
            }
          } // if value is not null

        } // else

      } // for loop Column
    } // for loop Row

    // Set Reference to InvitroAssayResultInformation
    // this.invitroResultInfo.invitroReferences[0].primaryReference = true;
    // this.invitroResultInfo.invitroReferences[0] = this.invitroReference;

  }

  createInvitroLaboratory(workbook: XLSX.WorkBook) {
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
        }
        else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          if (worksheetRefLab[cellKey].v) {
            if (worksheetRefLab[cellKey].v.trim() === 'Laboratory Name *') {
              this.invitroLaboratory.laboratoryName = this.getValue(worksheetRefLab[cellKeyValue]);
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

  createInvitroSponsor(workbook: XLSX.WorkBook) {
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
        }
        else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          if (worksheetRefLab[cellKey].v) {
            if (worksheetRefLab[cellKey].v.trim() === 'Sponsor Contact Name *') {
              this.invitroSponsor.sponsorContactName = this.getValue(worksheetRefLab[cellKeyValue]);
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

  createInvitroSponsorSubmitters(workbook: XLSX.WorkBook) {
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
        }
        else { // Key found in the cell

          this.invitroSponsorSubmitter = this.invitroSponsorReport.invitroSponsorSubmitters[0];
          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          // if Key exists
          if (worksheet[cellKey].v) {

            if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Name *') {
              this.invitroSponsorSubmitter.sponsorReportSubmitterName = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Title') {
              this.invitroSponsorSubmitter.sponsorRepoortSubmitterTitle = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Affiliation') {
              this.invitroSponsorSubmitter.sponsorReportSubmitterAffiliation = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Email') {
              this.invitroSponsorSubmitter.sponsorReportSubmitterEmail = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Phone Number') {
              this.invitroSponsorSubmitter.sponsorReportSubmitterPhoneNumber = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Sponsor Report Submitter Assay Type') {
              this.invitroSponsorSubmitter.sponsorReportSubmitterAssayType = this.getValue(worksheet[cellKeyValue]);
            }
          } // if value is not null

        } // else

      } // for loop Column

    } // for loop Row
    //this.invitroSponsorReport.invitroSponsorSubmitters.push(this.invitroSponsorSubmitter);
  }

  createInvitroSponsorReport(workbook: XLSX.WorkBook) {
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
        }
        else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          if (worksheet[cellKey].v) {
            if (worksheet[cellKey].v.trim() === 'Report Number *') {
              this.invitroSponsorReport.reportNumber = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Report Date *') {

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

  createInvitroTestAgent(workbook: XLSX.WorkBook) {
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
        }
        else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          if (worksheet[cellKey].v) {
            if (worksheet[cellKey].v.trim() === 'Test Agent ID (Company Code) *') {
              this.invitroTestAgent.testAgentCompanyCode = this.getValue(worksheet[cellKeyValue]);
            } else if (worksheet[cellKey].v.trim() === 'Test Agent Name  (FDA) *') {
              this.invitroTestAgent.testAgent = this.getValue(worksheet[cellKeyValue]);
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

  }

  createInvitroBatchNumber(workbook: XLSX.WorkBook) {
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
        }
        else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          if (worksheet[cellKey].v) {
            if (worksheet[cellKey].v.trim() === 'Batch Number') {
              this.invitroResultInfo.batchNumber = this.getValue(worksheet[cellKeyValue]);
            }
          } // if value is not null
        } // else

      } // for loop Column
    } // for loop Row

  }

  createInvitroControls(workbook: XLSX.WorkBook) {
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
        element["controlType"] = this.replaceUndefinedValue(element["Type of Control"]);
        element["controlValueType"] = this.replaceUndefinedValue(element["Control Value Type"]);
        element["controlValue"] = this.replaceUndefinedValue(element["Control Value"]);
        element["controlValueUnits"] = this.replaceUndefinedValue(element["Control Value Units"]);

        // Delete Excel Object key
        delete element["External Assay Source *"];
        delete element["External Assay ID *"];
        delete element["Assay ID"];
        delete element["Control Substance"];
        delete element["Type of Control"];
        delete element["Control Value Type"];
        delete element["Control Value"];
        delete element["Control Value Units"];
      }

    });
  }

  createInvitroResults(workbook: XLSX.WorkBook) {
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
        element["externalAssaySource"] = this.replaceUndefinedValue(element["External Assay Source *"]);
        element["externalAssayId"] = this.replaceUndefinedValue(element["External Assay ID *"]);
        element["externalAssayUrl"] = this.replaceUndefinedValue(element["External Assay URL/Document Link"]);
        element["assayId"] = this.replaceUndefinedValue(element["Assay ID"]);
        let testDateNum = this.replaceUndefinedValue(element["Test Date (mm/dd/yyyy)"]);
        element["testAgentConcentration"] = this.replaceUndefinedValue(element["Test Agent Concentration"]);
        element["testAgentConcentrationUnits"] = this.replaceUndefinedValue(element["Test Agent Concentration Units"]);
        element["resultValue"] = this.replaceUndefinedValue(element["Result Value"]);
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

        // Delete Excel Object key
        delete element["External Assay Source *"];
        delete element["External Assay ID *"];
        delete element["External Assay URL/Document Link"];
        delete element["Assay ID"];
        delete element["Test Date (mm/dd/yyyy)"];
        delete element["Test Agent Concentration"];
        delete element["Test Agent Concentration Units"];
        delete element["Result Value"];
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
        delete element["Measurements"];
      }

    });
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

  validateExcelImportData() {
    let foundallAssays = 'true';

    // Validate if Assay already Exists into the database
    this.invitroResultsTemp.forEach((result, index) => {
      if (result.externalAssaySource && result.externalAssayId) {

        const invitroSubscribe = this.invitroPharmacologyService.getAssayByExternalAssay(result.externalAssaySource, result.externalAssayId).subscribe(assay => {
          if (assay) {
            // Assay Found in the Database
            result.assayFoundInDb = 'true';

            this.createNewScreeningData(assay, result);
            // this.invitroAssayFoundInDatabase.push(result);
          }
          else {
            // Assay NOT Found in the Database
            result.assayFoundInDb = 'false';
            foundallAssays = 'false';
          }
        }, error => {
          result.assayFoundInDb = 'Error getting Assay';
          console.log("Import Screeing data - error getting Assay");
        }
        );  // subscribe

        this.subscriptions.push(invitroSubscribe);
      }

    });

    // if (found)
    // Enable "Import into the Database" button
    this.disableImportButton = 'false';
  }

  createNewScreeningData(assay: InvitroAssayInformation, resultElement: any) {
    // Create new screening object
    const screening: InvitroAssayScreening = {};

    const date = new Date();
    let importfilename = "import_screening_" + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    screening.screeningImportFileName = importfilename;

    // Invitro Result
    screening.invitroAssayResult = this.createInvitroResult(resultElement);

    // Push screening to Assay
    assay.invitroAssayScreenings.push(screening);

    // Push screening to Assay
    this.invitroAssayScreenings.push(screening);

    this.assayToSave.push(assay);
  }

  createInvitroReference(object: any): any {
    let tempObject = _.cloneDeep(object);

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

  createInvitroResult(object: any): any {
    let tempObject = _.cloneDeep(object);

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

  importAssayJSONIntoDatabase2() {

    let savedResultInfo: any;

    if (this.invitroAssayScreenings.length > 0) {

      let firstScreeningToSave = this.invitroAssayScreenings[0];
      let assayId = firstScreeningToSave._ownerId;
      let scrubScreening = this.scrub(firstScreeningToSave);

      firstScreeningToSave.invitroAssayResultInformation = {};
      firstScreeningToSave.invitroAssayResultInformation.invitroReferences[0] = this.invitroReference;

      const saveFirstScreeningSubscribe = this.invitroPharmacologyService.saveScreening(scrubScreening, assayId).subscribe(responseFirstScreening => {
        if (responseFirstScreening) {
          if (responseFirstScreening.id) {

            //if (responseScreening.invitroAssayScreenings.length > 0) {
            // let screening = responseAssay.invitroAssayScreenings[responseAssay.invitroAssayScreenings.length - 1];

            // Check if InvitroAssayResultInformation data in the first screening was saved
            // successfully into the database
            savedResultInfo = responseFirstScreening.invitroAssayResultInformation;

            // if successful, save the remaining screening into the database.
            if (savedResultInfo) {

              // remove the first screening, save the remaining screeing into the database
              this.invitroAssayScreenings.splice(0, 1);

              // Copy the screening to new variable
              let remainingScreening = _.cloneDeep(this.invitroAssayScreenings);

              remainingScreening.forEach(screening => {
                if (screening) {

                  //  screening.invitroAssayResultInformation = savedResultInfo
                  screening.invitroAssayResultInformation = {};
                  screening.invitroAssayResultInformation.id = savedResultInfo.id;
                  //  screening.invitroAssayResultInformation.internalVersion = savedResultInfo.internalVersion;

                  let remainingAssayId = screening._ownerId;
                  let remainingScrubScreening = this.scrub(screening);

                  const saveSubscribe = this.invitroPharmacologyService.saveScreening(remainingScrubScreening, remainingAssayId).subscribe(response => {
                    if (response) {

                      if (response.id) {
                      }
                    } // if response
                  });
                  this.subscriptions.push(saveSubscribe);

                } //   if (screening)
              });  // forloop remainingScreening

            } // if (savedResultInfo)

          }  // if (responseFirstScreening.id)
        }  //  if (responseFirstScreening)
      }); // save one Assay record first
      this.subscriptions.push(saveFirstScreeningSubscribe);
    }
  }

  importAssayJSONIntoDatabase() {

    this.loadingService.setLoading(true);

    let savedResultInfo: any;
    if (this.assayToSave.length > 0) {

      let firstAssayToSave = this.assayToSave[0];

      // Set Reference to Result Information Object
      this.invitroResultInfo.invitroLaboratory = this.invitroLaboratory;
      this.invitroResultInfo.invitroSponsor = this.invitroSponsor;
      this.invitroResultInfo.invitroSponsorReport = this.invitroSponsorReport;
      this.invitroResultInfo.invitroTestAgent = this.invitroTestAgent;

      // Set invitroAssayResultInformation in first Assay Record
      firstAssayToSave.invitroAssayScreenings[firstAssayToSave.invitroAssayScreenings.length - 1].invitroAssayResultInformation = this.invitroResultInfo;

      // Assign assay to Servive assay
      this.invitroPharmacologyService.assay = firstAssayToSave;

      const saveOneAssaySubscribe = this.invitroPharmacologyService.saveAssay().subscribe(responseAssay => {
        if (responseAssay) {
          if (responseAssay.id) {
            if (responseAssay.invitroAssayScreenings.length > 0) {

              // Get the last screening from the returned/saved Assay
              let screening = responseAssay.invitroAssayScreenings[responseAssay.invitroAssayScreenings.length - 1];

              savedResultInfo = screening.invitroAssayResultInformation;

              // First invitroAssayResultInformation has been saved. Get the id
              if (savedResultInfo) {

                // Remove/delete the first Assay from the list
                this.assayToSave.splice(0, 1);

                // CLone/Copy the remaining assay
                let remainingBulkAssay = _.cloneDeep(this.assayToSave);

                remainingBulkAssay.forEach(assay => {
                  if (assay) {
                    assay.invitroAssayScreenings.forEach(screening => {
                      // Assign the first invitroAssayResultInformation here.

                      // screening.invitroAssayResultInformation = savedResultInfo;

                      //  screening.invitroAssayResultInformation = {};
                      //  screening.invitroAssayResultInformation.id = savedResultInfo.id;
                      //   screening.invitroAssayResultInformation.internalVersion = savedResultInfo.internalVersion;

                    });

                    //  assay.invitroAssayScreenings[assay.invitroAssayScreenings.length - 1].invitroAssayResultInformation = {};
                    //  assay.invitroAssayScreenings[assay.invitroAssayScreenings.length - 1].invitroAssayResultInformation.id = savedResultInfo.id;

                    // Assign the assay to service assay
                    this.invitroPharmacologyService.assay = assay;

                    const saveSubscribe = this.invitroPharmacologyService.saveAssay().subscribe(response => {
                      if (response) {

                        setTimeout(() => {
                          // // this.showSubmissionMessages = false;
                          //  this.submissionMessage = '';
                          if (response.id) {
                            this.loadingService.setLoading(false);

                            this.invitroPharmacologyService.bypassUpdateCheck();
                            const id = response.id;
                            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                            this.router.onSameUrlNavigation = 'reload';
                            this.router.navigate(['/invitro-pharm/', savedResultInfo.id, 'edit']);
                          }
                        }, 4000);
                      } // if response remaining assays

                    });
                    this.subscriptions.push(saveSubscribe);

                  } // if assay exists in remainingBulk list

                }); // forloop remainingBulk
              } // if savedResultInfo exists

            } // if responseAssay.invitroAssayScreenings.length > 0
          }
        }
      }); // save one Assay record first
      this.subscriptions.push(saveOneAssaySubscribe);
    }
  }

  showJSON(): void {
    let json: any = {};
    if (this.assayToSave.length > 0) {
      //  if (this.importedAssayJson !== undefined || this.importedAssayJson != null) {
      json = this.assayToSave;
    }
    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: json
    });

    // this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  scrub(oldraw: any): any {
    const old = oldraw;

    delete old['_ownerId'];

    return old;
  }
}
