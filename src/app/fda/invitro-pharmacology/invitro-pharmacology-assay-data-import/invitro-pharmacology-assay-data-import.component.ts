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
import { InvitroAssayInformation, ValidationMessage } from '../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-assay-data-import',
  templateUrl: './invitro-pharmacology-assay-data-import.component.html',
  styleUrls: ['./invitro-pharmacology-assay-data-import.component.scss']
})
export class InvitroPharmacologyAssayDataImportComponent implements OnInit {

  private subscriptions: Array<Subscription> = [];

  importDataList: Array<any> = [];
  importedBulkAssayJson: Array<InvitroAssayInformation> = [];
  importedAssayJson: any;

  message = '';
  submitMessage = '';
  disabled = "true";
  willDownload = false;

  name = 'This is XLSX TO JSON CONVERTER';

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
            element["_assaySet"] = this.replaceUndefinedValue(element["Assay Set"]);


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

        // Un-disable the import button
        this.disabled = "false";

      } // reader.onload

      reader.readAsBinaryString(target.files[0]);


    } // else

    // let datafirstrow = (XLSX.utils.sheet_to_json(ws, {skipHeader: true, origin: "A2"}));
    // console.log(datafirstrow);
  }

  replaceUndefinedValue(value): string {
    return (value === undefined || value == null || value.length <= 0) ? "": value;
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
    alert(this.importedAssayJson);
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
