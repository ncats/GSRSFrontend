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
import { InvitroAssayInformation, InvitroReference, InvitroLaboratory,
  ValidationMessage } from '../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-screening-data-import',
  templateUrl: './invitro-pharmacology-screening-data-import.component.html',
  styleUrls: ['./invitro-pharmacology-screening-data-import.component.scss']
})

export class InvitroPharmacologyScreeningDataImportComponent implements OnInit {

  private subscriptions: Array<Subscription> = [];

  invitroReference: InvitroReference = {};
  invitroLaboratory: InvitroLaboratory = {};

  importDataList: Array<any> = [];
  importedBulkAssayJson: Array<InvitroAssayInformation> = [];
  importedAssayJson: any;

  message = '';
  submitMessage = '';
  disabled = "true";
  willDownload = false;

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
      // Empty the list
      this.importDataList.length = 0;

      // Assign FileReader
      const reader: FileReader = new FileReader();

      // Read the Excel file
      reader.onload = (e: any) => {

        const excelFileData: string = e.target.result;

        // Load Excel File data into the WorkBook object
        const workbook: XLSX.WorkBook = XLSX.read(excelFileData, { type: 'binary' });

        this.createInvitroReference(workbook);

        this.createInvitroLaboratory(workbook);

        /*
        // Read the Second Excel Spreadsheet, the worksheet index starts with 0.
        // Read Sheet "1. Reference and Laboratory"
        const worksheetName = workbook.SheetNames[1];
        const worksheetRefLab: XLSX.WorkSheet = workbook.Sheets[worksheetName];

        // If header is specified, the first row is considered a data row; if header is not specified,
        // the first row is the header row and not considered data.
        // Null values are returned when raw is true but are skipped when false.
        //  this.importedAssayJson = (XLSX.utils.sheet_to_json(ws, { raw: true }));

        // Read Range A1:A4 in Sheet 2, Read the Key to create JSON object
        var rangeRefLab = { s: { r: 0, c: 0 }, e: { r: 3, c: 0 } }; // A1:A4

        // Loop through the range
        for (var R = rangeRefLab.s.r; R <= rangeRefLab.e.r; ++R) {
          for (var C = rangeRefLab.s.c; C <= rangeRefLab.e.c; ++C) {

            var cell_address = { r: R, c: C };
            //  var cell_address = { r: R, c: 0 };  // row n and column 1

            // Read cell
            var cellKey = XLSX.utils.encode_cell(cell_address);

            // No data found in the cell object
            if (!worksheetRefLab[cellKey]) {
              // do something here
              console.log("CCCCCCCCCCCCCCCC " + JSON.stringify(worksheetRefLab[cellKey]));
            }
            else { // Key found in the cell

              // if (worksheetRefLab[cellKey].v === 'Reference Source Type *') {
              // Read the key value in the next column
              var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

              // JSON.stringify(worksheetRefLab[cellKeyValue])
              // Cell object returns something like this: {"t":"s","v":"ABCD","r":"<t>ABCD</t>","h":"ABCD","w":"ABCD"}
              console.log("CCCCCCCCCCCCCCCC " + JSON.stringify(worksheetRefLab[cellKeyValue]));
              // if key value exists
              // if (worksheetRefLab[cellKeyValue]) {

              // this.invitroReference["referenceSourceType"] = this.getValue(worksheetRefLab[cellKeyValue]);
              //  this.invitroReference.referenceSourceType = worksheetRefLab[cellKeyValue].v;
              //  }

              this.invitroReference["referenceSourceType"] = (worksheetRefLab[cellKey].v === 'Reference Source Type *') ? this.getValue(worksheetRefLab[cellKeyValue]) : "abc";

              // return (object.v === undefined || object.v == null || object.v.length <= 0) ? "" : object.v;


              //  }

            } // else

            //dataRange.push(worksheet[data]);
          } // for loop Column
        } // for loop Row

        console.log("JSON " + JSON.stringify(this.invitroReference));
        */


        /*
        var range = XLSX.utils.decode_range(ws['!ref']);
        for(var R = range.s.r; R <= range.e.r; ++R) {
        for(var C = range.s.c; C <= range.e.c; ++C) {
          var cell_address = {c:C, r:R};
          // if an A1-style address is needed, encode the address
          var cell_ref = XLSX.utils.encode_cell(cell_address);
         // cell_ref.
        console.log("WWWWWWWWWWWW " + JSON.stringify(cell_address));
        //console.log("YYYYYY " + J(cell_address));
      //  console.log(C.v)

        }
      }
      */

        /*
       // for (var sn in workbook.SheetNames) {
         // var sheet = workbook.Sheets[workbook.SheetNames[sn]];
          let range = XLSX.utils.decode_range(ws['!ref']);
          for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {

              //column c
            //  let c = ws[XLSX.utils.encode_cell({r: rowNum, c: 2})];
              //column d
              let d = ws[XLSX.utils.encode_cell({r: rowNum, c: 3})];
               console.log("RRRRRRRRRRRR " + d.v);
              // get data using c.v or d.v
          }
     // }
        */

        /*
      //  for (var sn in wb.SheetNames) {
          var sheet = wb.Sheets[wb.SheetNames[1]];
          var range = XLSX.utils.decode_range(sheet['!ref']);

          for (var rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {

              //column c
              var c = sheet[XLSX.utils.encode_cell({r: rowNum, c: 2})];
              //column d
              var d = sheet[XLSX.utils.encode_cell({r: rowNum, c: 3})];

              console.log(JSON.stringify(c) +  "   " + d);

              // get data using c.v or d.v
        //  }  */
        // }


        // console.log("AAAAAAAAAAAAA " + JSON.stringify(this.importedAssayJson));
        /*
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
            element["assaySet"] = this.replaceUndefinedValue(element["Assay Set"]);


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

            delete element["Assay Set"]

            // Add to list
            this.importDataList.push(element);
          } // element

        }); // LOOP: importedAssayJson

        */
        // Un-disable the import button
        this.disabled = "false";

      } // reader.onload

      reader.readAsBinaryString(target.files[0]);


    } // else single file selected

    // let datafirstrow = (XLSX.utils.sheet_to_json(ws, {skipHeader: true, origin: "A2"}));
    // console.log(datafirstrow);
  }

  createInvitroReference(workbook: XLSX.WorkBook) {
    // Read the Second Excel Spreadsheet, the worksheet index starts with 0.
    // Read Sheet "1. Reference and Laboratory"
    const worksheetName = workbook.SheetNames[1];
    const worksheetRefLab: XLSX.WorkSheet = workbook.Sheets[worksheetName];

    // Read Range A1:A4 in Sheet 2, Read the Key to create JSON object
    var rangeRefLab = { s: { r: 0, c: 0 }, e: { r: 3, c: 0 } }; // A1:A4

    // Loop through the range
    for (var R = rangeRefLab.s.r; R <= rangeRefLab.e.r; ++R) {
      for (var C = rangeRefLab.s.c; C <= rangeRefLab.e.c; ++C) {

        var cell_address = { r: R, c: C };
        //  var cell_address = { r: R, c: 0 };  // row n and column 1

        // Read cell
        var cellKey = XLSX.utils.encode_cell(cell_address);

        // No data found in the cell object
        if (!worksheetRefLab[cellKey]) {
          // do something here
          console.log("CCCCCCCCCCCCCCCC " + JSON.stringify(worksheetRefLab[cellKey]));
        }
        else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          // JSON.stringify(worksheetRefLab[cellKeyValue])
          // Cell object returns something like this: {"t":"s","v":"ABCD","r":"<t>ABCD</t>","h":"ABCD","w":"ABCD"}


          // console.log("AAAAAAAAAA" + JSON.stringify(worksheetRefLab[cellKeyValue]));

          if (worksheetRefLab[cellKey].v) {
            if (worksheetRefLab[cellKey].v.trim() === 'Reference Source Type *') {
              this.invitroReference.referenceSourceType = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Reference Source Id') {
              this.invitroReference.referenceSource = this.getValue(worksheetRefLab[cellKeyValue]);
            } else if (worksheetRefLab[cellKey].v.trim() === 'Reference URL') {
              this.invitroReference.digitalObjectIdentifier = this.getValue(worksheetRefLab[cellKeyValue]);
            }
          } // if value is not null
        } // else

      } // for loop Column
    } // for loop Row

    console.log("JSON " + JSON.stringify(this.invitroReference));

  }

  createInvitroLaboratory(workbook: XLSX.WorkBook) {
    // Read the Second Excel Spreadsheet, the worksheet index starts with 0.
    // Read Sheet "1. Reference and Laboratory"
    const worksheetName = workbook.SheetNames[1];
    const worksheetRefLab: XLSX.WorkSheet = workbook.Sheets[worksheetName];

    // Read Range A7:A15 in Sheet 2, Read the Key to create JSON object
    var rangeRefLab = { s: { r: 6, c: 0 }, e: { r: 14, c: 0 } }; // A7:A15

    // Loop through the range
    for (var R = rangeRefLab.s.r; R <= rangeRefLab.e.r; ++R) {
      for (var C = rangeRefLab.s.c; C <= rangeRefLab.e.c; ++C) {

        var cell_address = { r: R, c: C };

        // Read cell
        var cellKey = XLSX.utils.encode_cell(cell_address);

        // No data found in the cell object
        if (!worksheetRefLab[cellKey]) {
          // do something here
          console.log("CCCCCCCCCCCCCCCC " + JSON.stringify(worksheetRefLab[cellKey]));
        }
        else { // Key found in the cell

          // Read the key value in the next column
          var cellKeyValue = XLSX.utils.encode_cell({ r: R, c: C + 1 });

          // JSON.stringify(worksheetRefLab[cellKeyValue])
          // Cell object returns something like this: {"t":"s","v":"ABCD","r":"<t>ABCD</t>","h":"ABCD","w":"ABCD"}


           console.log("AAAAAAAAAA" + JSON.stringify(worksheetRefLab[cellKeyValue]));

          if (worksheetRefLab[cellKey].v) {
            if (worksheetRefLab[cellKey].v.trim() === 'Laboratory Name *') {
              console.log("TTTTTTTTTTTTTTTTT");
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

    console.log("JSON " + JSON.stringify(this.invitroLaboratory));

  }

  getValue(object: any): string {
    // Return value if the Object is not null
    if (object) {
      return (object.v === undefined || object.v == null || object.v.length <= 0) ? "" : object.v;
    }
  }


  /*
  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector("#download");
      el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
      el.setAttribute("download", 'xlsxtojson.json');
    }, 1000)
  }
  */

  importAssayJSONIntoDatabase() {
    // Loop through each Assay JSON Record, and save into the database
    this.importedAssayJson.forEach((element, index) => {
      if (element) {
        //  console.log("index: " + index + "     " + JSON.stringify(element));
        this.message = this.message + "index: " + index + "     " + JSON.stringify(element) + "\n\n";
        this.invitroPharmacologyService.assay = JSON.parse(JSON.stringify(element));
        this.invitroPharmacologyService.saveAssay().subscribe(response => {
          this.message = "";
          this.submitMessage = "Import Successful";
        });
      }
    })
  }

  showJSON(): void {
    let json: any = {};
    if (this.importedAssayJson !== undefined || this.importedAssayJson != null) {
      json = this.importedAssayJson;
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

}
