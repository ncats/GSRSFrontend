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
import { InvitroAssayScreening, ValidationMessage } from '../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-data-import',
  templateUrl: './invitro-pharmacology-data-import.component.html',
  styleUrls: ['./invitro-pharmacology-data-import.component.scss']
})
export class InvitroPharmacologyDataImportComponent implements OnInit {

  importDataList: Array<any> = [];
  importJson: any;
  message = '';
  submitMessage = '';

  name = 'This is XLSX TO JSON CONVERTER';
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

  onFileChange(evt) {
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
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        // If header is specified, the first row is considered a data row; if header is not specified, the first row is the header row and not considered data.
        // null values are returned when raw is true but are skipped when false.
        let data = (XLSX.utils.sheet_to_json(ws, { raw: true }));

       // let datafirstrow = (XLSX.utils.sheet_to_json(ws, {skipHeader: true, origin: "A2"}));
       // console.log(datafirstrow);


        this.importJson = data;

        data.forEach((element, index) => {
          if (element) {
           // console.log("index: " + index + "     " + JSON.stringify(element));

            this.importDataList.push(element);
            this.message = this.message + "index: " + index + "     " + JSON.stringify(element) + "\n\n";
         //   this.invitroPharmacologyService.assayScreening = JSON.parse(JSON.stringify(element));
           // this.invitroPharmacologyService.saveAssayScreening().subscribe(response => {
//
          //  });
          }
        })
      }
      reader.readAsBinaryString(target.files[0]);
    }
  }

  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector("#download");
      el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
      el.setAttribute("download", 'xlsxtojson.json');
    }, 1000)
  }

  importJSON() {
    this.importJson.forEach((element, index) => {
      if (element) {
        console.log("index: " + index + "     " + JSON.stringify(element));
        this.message = this.message + "index: " + index + "     " + JSON.stringify(element) + "\n\n";
        this.invitroPharmacologyService.assayScreening = JSON.parse(JSON.stringify(element));
       this.invitroPharmacologyService.saveAssayScreening().subscribe(response => {
        this.message = "";
        this.submitMessage = "Import Successful";
        });
      }
    })
  }
}
