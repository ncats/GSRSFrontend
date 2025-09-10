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

  requiredFieldMissingArray: Array<any> = [];
  importDataList: Array<any> = [];
  importedBulkAssayJson: Array<InvitroAssayInformation> = [{}];
  importedAssayJson: any;

  message = '';
  submitMessage = '';
  resultMessage = '';
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
    this.titleService.setTitle("IVP Import Screening Data");

    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').pipe(take(1)).subscribe(response => {
      this.isAdmin = response;
    });
    
    this.initializeRequiredFieldArray();
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

        // Validate all data from Excel file
        this.validate();

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
        }
        else { // Key found in the cell

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
            }
            else if (worksheetRefLab[cellKey].v.trim() === 'Reference Source/Citation *') {
              this.invitroReference.sourceCitation = this.getValue(worksheetRefLab[cellKeyValue]);

              // ** Validate Required field
              if (!this.invitroReference.sourceCitation) {
                this.requiredFieldMissingArray[0].sourceCitation = true;
              }
            }
            else if (worksheetRefLab[cellKey].v.trim() === 'Reference Source Id') {
              this.invitroReference.sourceId = this.getValue(worksheetRefLab[cellKeyValue]);
            }
            else if (worksheetRefLab[cellKey].v.trim() === 'Reference Digital Object Identifier') {
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

    // Set Reference to InvitroAssayResultInformation
    // this.invitroResultInfo.invitroReferences[0].primaryReference = true;
    // this.invitroResultInfo.invitroReferences[0] = this.invitroReference;

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
        }
        else { // Key found in the cell

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
        }
        else { // Key found in the cell

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
        }
        else { // Key found in the cell

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
    //this.invitroSponsorReport.invitroSponsorSubmitters.push(this.invitroSponsorSubmitter);
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
        }
        else { // Key found in the cell

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
        }
        else { // Key found in the cell

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
        }
        else { // Key found in the cell

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

  validate() {

    //this.checkControlAssayFoundInDatabase();

    this.checkResultAssayFoundInDatabase();

    /*
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
  */

  }

  /*
  checkControlAssayFoundInDatabase() {
    let foundallAssays = 'true';

    // Validate if Assay already Exists into the database
    this.invitroControlsTemp.forEach((control, index) => {
      if (control.externalAssaySource && control.externalAssayId) {

        const invitroSubscribe = this.invitroPharmacologyService.getAssayByExternalAssay(control.externalAssaySource, control.externalAssayId).subscribe(assay => {
          if (assay) {
            // Assay Found in the Database
            control.assayFoundInDb = 'true';
          }
          else {
            // Assay NOT Found in the Database
            control.assayFoundInDb = 'false';
            foundallAssays = 'false';
          }
        }, error => {
          control.assayFoundInDb = 'Error getting Assay';
          console.log("Import Screeing data - error getting Assay");
        }
        );  // subscribe

        this.subscriptions.push(invitroSubscribe);
      } else {
        foundallAssays = 'false';
      }

    });

    // Enable "Import into the Database" button
    this.disableImportButton = 'false';
  }
  */

  checkResultAssayFoundInDatabase() {
    let foundallAssays = 'true';
    this.resultMessage = '';

    // Validate if Assay already Exists into the database
    this.invitroResultsTemp.forEach((result, index) => {

      if (result.externalAssaySource && result.externalAssayId) {

        this.resultMessage = 'Checking Assays in the database ...';

        /*
        // CONTROL ASSAY CHECK, check if Result Assays match control Assays
        this.invitroControlsTemp.forEach(ctrl => {
          if (ctrl) {
            if ((ctrl.externalAssaySource) && (ctrl.externalAssayId)) {

              // if Result and Control Assays match 
              if ((ctrl.externalAssaySource.externalAssaySource === result.externalAssaySource)
                && (ctrl.externalAssayId === result.externalAssayId)) {
                controlAssayMatch = true;
              }
            }
          } // if control object exists
        }); // control loop
        */

        const invitroSubscribe = this.invitroPharmacologyService.getAssayByExternalAssay(result.externalAssaySource, result.externalAssayId).subscribe(assay => {
          if (assay) {
            // Assay Found in the Database
            result.assayFoundInDb = 'true';

            this.createNewScreeningData(assay, result);
          }
          else {
            // Assay NOT Found in the Database
            result.assayFoundInDb = 'false';
            foundallAssays = 'false';
          }

          if (this.invitroResultsTemp.length === (index + 1)) {
            this.resultMessage = '';
          }

        }, error => {
          result.assayFoundInDb = 'Error getting Assay';
          console.log("Import Screeing data - error getting Assay");
        }
        );  // subscribe

        this.subscriptions.push(invitroSubscribe);
      } else {
        foundallAssays = 'false';
      }

    });

    // Enable "Import into the Database" button
    this.disableImportButton = 'false';
  }

  createNewScreeningData(assay: InvitroAssayInformation, resultElement: any) {
    // Create new screening object
    const screening: InvitroAssayScreening = {};

    const date = new Date();
    let importfilename = "import_screening_" + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    screening.screeningImportFileName = importfilename;

    // Create new Invitro Control and Result
    screening.invitroControls = this.createNewInvitroControl(resultElement);
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

  createNewInvitroControl(resultObject: any): any {
    let invitroControls: Array<InvitroControl> = [];

    let tempResultObject = _.cloneDeep(resultObject);

    // CONTROL ASSAY CHECK, check if Result Assays match control Assays
    this.invitroControlsTemp.forEach(ctrl => {
      if (ctrl) {
        if ((ctrl.externalAssaySource) && (ctrl.externalAssayId)) {
          // if Result and Control Assays match 
          if ((ctrl.externalAssaySource === tempResultObject.externalAssaySource)
            && (ctrl.externalAssayId === tempResultObject.externalAssayId)) {
            let tempObject = _.cloneDeep(ctrl);

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

  /*
  importAssayJSONIntoDatabase2() {

    let savedResultInfo: any;

    if (this.invitroAssayScreenings.length > 0) {

      let firstScreeningToSave = this.invitroAssayScreenings[0];
     // let assayId = firstScreeningToSave._ownerId;
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

                  //let remainingAssayId = screening._ownerId;
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
  */

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

  importAssayJSONIntoDatabase() {

    this.loadingService.setLoading(true);

    let savedResultInfo: any;
    if (this.assayToSave.length > 0) {

      let firstAssayToSave = this.assayToSave[0];

      // Set Reference to Result Information Object
      this.invitroResultInfo.invitroReferences = this.invtroReferences;
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

                    assay.invitroAssayScreenings[assay.invitroAssayScreenings.length - 1].invitroAssayResultInformation = savedResultInfo;
                    //assay.invitroAssayScreenings[assay.invitroAssayScreenings.length - 1].invitroAssayResultInformation = {};
                    //assay.invitroAssayScreenings[assay.invitroAssayScreenings.length - 1].invitroAssayResultInformation.id = savedResultInfo.id;

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
