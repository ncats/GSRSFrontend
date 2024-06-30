import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
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
  selector: 'app-invitro-pharmacology-assayset-form',
  templateUrl: './invitro-pharmacology-assayset-form.component.html',
  styleUrls: ['./invitro-pharmacology-assayset-form.component.scss']
})

export class InvitroPharmacologyAssaysetFormComponent implements OnInit {

  @ViewChildren('checkBox') checkBox: QueryList<any>;

  // Form Control
  existingAssayControl = new FormControl();
  existingAssaySetControl = new FormControl();

  allAssaysList: Array<InvitroAssayInformation> = [];
  existingAssaySetList: Array<any> = [];
  existingAssaysByAssaySetList: Array<InvitroAssayInformation> = [];
  checkBoxAssaySetList: Array<any> = [];

  private subscriptions: Array<Subscription> = [];

  title: string;
  message: string;
  isAdmin = false;
  username = null;
  isLoading = false;
  assayMessage = '';
  selectedAssaySet = '';
  newAssaySet = '';

  errorMessage: string;
  serverError: boolean;
  submissionMessage: string;
  showSubmissionMessages = false;
  validationResult = false;
  validationMessages: Array<ValidationMessage> = [];

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

  ngOnInit(): void {

    // Check if user has either Admin or Updater role
    this.authService.hasAnyRolesAsync('DataEntry', 'SuperDataEntry', 'Admin').subscribe(response => {
      this.isAdmin = response;
    });

    // Get Username
    this.username = this.authService.getUser();

    this.titleService.setTitle(`Assay Set Builder`);
    this.title = 'Assay Set Builder';

    // Get All the Assay Sets for checkbox
    this.getAllAssaySets();

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getAllAssaySets() {
    this.loadingService.setLoading(true);
    this.isLoading = true;
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllAssaySets().subscribe(response => {
      if (response) {
        this.existingAssaySetList = response;

        // Create checboxes
        //this.createAssaySetCheckBoxes();

        //if (this.id) {
        // if Assay record exists, load the Assay set in the checkboxes
        // this.loadCheckBoxAssaySetList();
        //}

        this.loadingService.setLoading(false);
        this.isLoading = false;
      }
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
      //this.handleProductRetrivalError();
    });
    this.subscriptions.push(getInvitroSubscribe);
  }

  /*
  getAllAssysByAssaySet(assaySet: string) {
    this.assayMessage = "Loading Assays ...";
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllAssysByAssaySet(assaySet).subscribe(response => {
      if (response) {
        this.existingAssaysByAssaySetList = response;

        // LOOP: assay list
        this.existingAssaysByAssaySetList.forEach((assay, indexAssay) => {


        }); // LOOP: assay

      } else {
        // this.handleRecordRetrivalError();
      }
      // this.loadingService.setLoading(false);
      //this.isLoading = false;
      this.assayMessage = "";
    }, error => {
      // this.loadingService.setLoading(false);
      // this.isLoading = false;
      // this.assayMessage = "";
      //this.handleRecordRetrivalError();

    });
    this.subscriptions.push(getInvitroSubscribe);
  }
  */

  getAllAssays(): void {
    this.assayMessage = "Loading Assays ...";
    this.loadingService.setLoading(true);
    this.isLoading = false;

    const invitroSubscribe = this.invitroPharmacologyService.getAllAssays().subscribe(response => {
      this.allAssaysList = response;

      // select the checkbox for the for the selected Assay Set that contains
      this.loadAssaySetCheckBox();

      this.assayMessage = "";

      this.loadingService.setLoading(false);
      this.isLoading = false;

    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }, () => {
      this.subscriptions.push(invitroSubscribe);
      this.loadingService.setLoading(false);
      this.isLoading = false;
    });
  }

  selectionChangeExistingAssaySet(event) {
    if (event) {
     /* if (this.allAssaysList.length > 0) {
        this.loadAssaySetCheckBox();
      } else {
     */
        // Get All Assays from the database
        this.getAllAssays();
     // }

      // Set the selected Assay Set
      this.selectedAssaySet = event;
    }
  }

  addNewAssaySet() {
    const newAssaySetObject = { assaySet: this.newAssaySet };
    this.existingAssaySetList.push(newAssaySetObject);

    this.assayMessage = 'New Assay Set \"' + this.newAssaySet + '\" added to the dropdown list';

    this.newAssaySet = '';
  }

  loadAssaySetCheckBox() {
    if (this.allAssaysList.length > 0) {
      this.allAssaysList.forEach(assay => {
        if (assay) {
          if (assay.invitroAssaySets) {
            if (assay.invitroAssaySets.length > 0) {

              // Set Assay Set to false
              //assay._assaySet = 'false';

              // Get the index if the value exists in the key 'assaySet'
              const indexAssaySet = assay.invitroAssaySets.findIndex(record => record.assaySet === this.selectedAssaySet);

              if (indexAssaySet != -1) {
                // Found Assay Set
                assay._assaySet = 'true';
              }
            }
          }
        }
      }); // LOOP: assay
    } // length > 0
  }

  createAssaySetCheckBoxes() {
    // Create checkboxes for each existing Assay Set from database
    this.existingAssaySetList.forEach(set => {
      let setObj = { value: set.assaySet, checked: false };
      this.checkBoxAssaySetList.push(setObj);
    });
  }

  validate(): void {

  }

}
