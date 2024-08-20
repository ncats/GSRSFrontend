import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { DatePipe, formatDate } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { forkJoin, Subscription } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
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
import { StructureImageModalComponent } from '@gsrs-core/structure';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';
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
  assaysAssingedToAssaySet: Array<InvitroAssayInformation> = [];
  beforeSaveAssaysNOTAssignedToAssaySet: Array<InvitroAssayInformation> = [];
  assaysNOTAssignedToAssaySet: Array<InvitroAssayInformation> = [];

  assaysToSave: Array<InvitroAssayInformation> = [];

  existingAssaySetList: Array<any> = [];
  existingAssaySetDatabaseList: Array<any> = [];

  assaysByAssaySetList: Array<InvitroAssayInformation> = [];
  checkBoxAssaySetList: Array<any> = [];

  private subscriptions: Array<Subscription> = [];

  assaySetFromUrl: string;
  newSavedAssaySet: any;
  title: string;
  message: string;
  isAdmin = false;
  username = null;
  isLoading = false;
  isBuildFromExistingSet = false;
  assayMessage = '';
  selectedAssaySet = '';
  newAssaySet = '';
  existingAssaySet = '';
  totalAllAssays = 0;

  tabSelectedIndex = 0;

  errorMessage: string;
  serverError: boolean;
  submissionMessage: string;
  showSubmissionMessages = false;
  validationResult = false;
  validationMessages: Array<ValidationMessage> = [];

  constructor(
    public http: HttpClient,
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
    this.assaySetFromUrl = this.activatedRoute.snapshot.queryParams['assaySet'];

    // Get All the Assay Sets for checkbox
    this.getAllAssaySets();

    /*
      if (this.isAssaySetExists(assaySetFromUrl) == true) {
        this.selectedAssaySet = assaySetFromUrl;
        // Get All Assays from the database
        this.getAllAssays(this.selectedAssaySet);
      } else {
        this.assayMessage = "Assay Set '" + assaySetFromUrl + "' does not exist in the database";
      }
    */
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
        this.existingAssaySetDatabaseList = JSON.parse(JSON.stringify(response));

        if (this.assaySetFromUrl) {
          if (this.isAssaySetExists(this.assaySetFromUrl) == true) {
            this.selectedAssaySet = this.assaySetFromUrl;

            // Get All Assays from the database
            this.getAllAssays(this.selectedAssaySet);
          } else {
            this.assayMessage = "Assay Set '" + this.assaySetFromUrl + "' does not exist in the database";
          }
        }

        this.loadingService.setLoading(false);
        this.isLoading = false;
      }
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
    });
    this.subscriptions.push(getInvitroSubscribe);
  }

  getAllAssysByAssaySet() {
    this.assayMessage = "Loading Assays ...";
    const getInvitroSubscribe = this.invitroPharmacologyService.getAllAssysByAssaySet(this.selectedAssaySet).subscribe(response => {
      if (response) {
        this.assaysByAssaySetList = response;

        this.assayMessage = "";

      } // if response

      this.assayMessage = "";
    }, error => {
    });

    this.subscriptions.push(getInvitroSubscribe);
  }

  getAllAssays(selectedAssaySet: string): void {
    this.assayMessage = "Loading Assays ...";
    this.loadingService.setLoading(true);
    this.isLoading = false;

    const invitroSubscribe = this.invitroPharmacologyService.getAllAssays().subscribe(response => {
      this.allAssaysList = response;
      this.totalAllAssays = response.length;

      // select the checkbox for the for the selected Assay Set that contains
      this.loadAssaySetCheckBox(selectedAssaySet);

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

  loadAssaySetCheckBox(selectedAssaySet: string) {
    if (this.allAssaysList.length > 0) {

      // clear the arrays
      this.assaysAssingedToAssaySet = [];
      this.assaysNOTAssignedToAssaySet = [];

      this.allAssaysList.forEach((assay, indexAssay) => {
        if (assay) {

          if (assay.invitroAssaySets) {
            if (assay.invitroAssaySets.length > 0) {

              // Get the index if the value exists in the key 'assaySet'
              const indexAssaySet = assay.invitroAssaySets.findIndex(record => record.assaySet === selectedAssaySet);

              // Assay Set FOUND in the Assay
              if (indexAssaySet != -1) {
                // Found Assay Set
                assay._assaySet = 'true';

                this.assaysAssingedToAssaySet.push(assay);

                if (this.isBuildFromExistingSet == true) {
                  // Copy this assay to new variable;
                  let assaySave = _.cloneDeep(assay);

                  if (this.newAssaySet) {
                    const newAssaySetObject = { assaySet: this.newAssaySet };

                    this.existingAssaySetList.push(newAssaySetObject);

                    //let existingAssaySetObject = assay.invitroAssaySets[indexAssaySet];

                    // Add in the Assay Save List to save into the database
                    assaySave.invitroAssaySets.push(newAssaySetObject);

                    this.assaysToSave.push(assaySave);
                  }
                }

              } else {
                // Assay Set NOT FOUND
                this.assaysNOTAssignedToAssaySet.push(assay);
              }
            } else {
              // if No AssaySet assign to this assay
              // Assay Set NOT FOUND
              this.assaysNOTAssignedToAssaySet.push(assay);
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

  selectionChangeExistingAssaySet(event) {
    if (event) {
      // Set the selected Assay Set
      this.selectedAssaySet = event;

      // Get All Assays from the database
      this.getAllAssays(this.selectedAssaySet);
    }
  }

  addNewAssaySet() {
    this.assayMessage = '';
    let indexAssaySet = -1;

    if (this.newAssaySet) {

      // Get the index if the value exists in the key 'assaySet'
      indexAssaySet = this.existingAssaySetList.findIndex(record => record.assaySet === this.newAssaySet);

      // Assay Set NOT FOUND in the existing Assay Set
      if (indexAssaySet > -1) {
        this.assayMessage = "The Assay Set \'" + this.newAssaySet + "\' already exists, please enter another Assay Set";
      }

    }

    // If New Assay Set already does not exists, enter a new one
    if (indexAssaySet == -1) {
      if (this.newAssaySet) {
        const newAssaySetObject = { assaySet: this.newAssaySet };
        this.existingAssaySetList.push(newAssaySetObject);

        // Assign the new Assay Set
        this.selectedAssaySet = this.newAssaySet;

        this.getAllAssays(this.newAssaySet);

        //this.assayMessage = 'New Assay Set \"' + this.newAssaySet + '\" added to the dropdown list';
      } else {
        this.assayMessage = "Enter value in field 'Enter New Assay Set'";
      }
    } // if indexAssaySet == -1

  }

  isAssaySetExists(assaySet: string): boolean {
    // Get the index if the value exists in the field 'assaySet'
    const indexAssaySet = this.existingAssaySetList.findIndex(record => record.assaySet === assaySet);

    // Assay Set NOT FOUND in the Existing Assay Set List in Database
    if (indexAssaySet == -1) {
      return false
    } else {
      // FOUND
      return true;
    }
  }

  addNewAssaySetFromExistingSet() {
    this.assayMessage = '';
    let indexAssaySet = -1;

    if (this.newAssaySet) {
      let assaySetExists = this.isAssaySetExists(this.newAssaySet);
      if (assaySetExists == true) {
        this.assayMessage = "The Assay Set \'" + this.newAssaySet + "\' already exists, please enter another Assay Set";
      }
    }

    if (this.existingAssaySet) {

      // Get the index if the value exists in the key 'assaySet'
      indexAssaySet = this.existingAssaySetList.findIndex(record => record.assaySet === this.existingAssaySet);

      // Assay Set NOT FOUND in the existing Assay Set
      if (indexAssaySet == -1) {
        this.assayMessage = "The Existing Assay Set \'" + this.existingAssaySet + "\' does not exists";
      }
    }

    // Build Assay Set from Existing Set
    if (this.newAssaySet && this.existingAssaySet && indexAssaySet > -1) {

      this.isBuildFromExistingSet = true;

      this.selectedAssaySet = this.newAssaySet;

      this.addNewAssaySet();

      this.getAllAssays(this.existingAssaySet);

    } else {
      if (!this.newAssaySet && !this.existingAssaySet) {
        this.assayMessage = "Enter values in fields 'Enter New Assay Set' and 'Enter Existing Assay Set'";
      } else if (!this.newAssaySet) {
        this.assayMessage = "Enter value in field 'Enter New Assay Set'";
      } else if (!this.existingAssaySet) {
        this.assayMessage = "Enter value in field 'Enter Existing Assay Set'";
      }
    }
  }

  confirmDeleteAssaySet() {

  }

  tabSelectedUpdated(event) {

  }

  updateCheckBoxAssaySet(checkBoxValue: any, assay: InvitroAssayInformation, actionType: string) {
    // Copy the Assay to new variable
    let assaySave = _.cloneDeep(assay);

    if (actionType) {
      if (actionType === 'add') {
        if (checkBoxValue == true) {

          // Checkbox is checked
          // Add existing Assay Set in the Assay

          // Get the index if the value exists in the key 'value'
          const indexAssaySet = this.existingAssaySetList.findIndex(record => record.assaySet === this.selectedAssaySet);

          // if Found
          if (indexAssaySet > -1) {
            const existingAssaySetObject = this.existingAssaySetList[indexAssaySet];

            assaySave.invitroAssaySets.push(existingAssaySetObject);
          } // indexSet > -1
          else {
            // Not Found, add a new object
            const newAssaySetObject = { assaySet: this.selectedAssaySet };
            assaySave.invitroAssaySets.push(newAssaySetObject);
          }
        }
      }

      if (actionType == 'remove') {
        // Checkbox is unchecked
        // Remove existing Assay Set from the Assay

        // Get the index to delete the Assay Set in the Assay
        const indexAssaySetInAssay = assay.invitroAssaySets.findIndex(record => record.assaySet === this.selectedAssaySet);

        assaySave.invitroAssaySets.splice(indexAssaySetInAssay, 1);
      }
    } // if actionType is not null

    const indexAssay = this.assaysToSave.findIndex(record => record.id === assay.id);

    // Assay not found
    if (indexAssay == -1) {
      this.assaysToSave.push(assaySave);
    } else {
      // If Assay found, delete it and resave it
      this.assaysToSave.splice(indexAssay, 1);
      this.assaysToSave.push(assaySave);
    }
  }

  submit(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);

    // Scrub extra fields before saving
    this.scrubExtraFields();

    // Get the index to delete the Assay Set in the Assay
    const indexAssaySetInDatabase = this.existingAssaySetDatabaseList.findIndex(record => record.assaySet === this.selectedAssaySet);

    if (indexAssaySetInDatabase == -1) {
      // it is a new Assay Set which is not in the database. Need to save the first Assay,
      // and get the Assay Set id.

      // Set service assay for the first record
      this.invitroPharmacologyService.assay = this.assaysToSave[0];

      this.invitroPharmacologyService.saveAssay().subscribe(response => {
        if (response) {
          let assay = response;
          if (assay.id) {
            if (assay.invitroAssaySets && assay.invitroAssaySets.length > 0) {

              const indexAssaySetFirstSaved = assay.invitroAssaySets.findIndex(record => record.assaySet === this.selectedAssaySet);

              if (indexAssaySetFirstSaved > -1) {
                // SAVED FIRST NEW ASSAY SET
                this.newSavedAssaySet = assay.invitroAssaySets[indexAssaySetFirstSaved];

                this.assaysToSave.forEach((assay, indexAssay) => {
                  if (indexAssay > 0) {
                    if (assay) {
                      const indexAssaySetRemaining = assay.invitroAssaySets.findIndex(record => record.assaySet === this.selectedAssaySet);

                      if (indexAssaySetRemaining > -1) {

                        assay.invitroAssaySets[indexAssaySetRemaining] = this.newSavedAssaySet;

                      }
                    }
                  }
                });

                this.saveBulkAssays(true);
              }
            }
          }
        }
      });
    } else {
      this.saveBulkAssays(false);
    }

  }

  saveBulkAssays(skipFirstRecord?: boolean) {
    let assayApiUrlList: any = [];

    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };

    const url = this.invitroPharmacologyService.apiBaseUrlWithInvitroPharmEntityUrl;

    this.assaysToSave.forEach((assay, indexAssay) => {
      if (skipFirstRecord == true && indexAssay == 0) {
        // Do not save the first assay record
      } else {
        const apiUrl = this.http.put<InvitroAssayInformation>(url, assay, options).pipe(
          catchError(error => { throw error; }));

        assayApiUrlList.push(apiUrl);
      }
    });

    let savedCount = 0;
    // Save Assays into the database
    forkJoin(assayApiUrlList).subscribe(
      results => {
        let resultList: any = [];
        resultList = results;
        // return list of array of the result
        resultList.forEach(result => {
          if (result.id) {
            savedCount = savedCount + 1;
          }
        });

        // if all the records are saved, refresh the page
        if (savedCount == assayApiUrlList.length) {
          this.validationMessages = null;
          this.submissionMessage = 'In-vitro Pharmacology Assay data was saved successfully!';
          this.showSubmissionMessages = true;
          this.validationResult = false;

          setTimeout(() => {
            this.showSubmissionMessages = false;
            this.submissionMessage = '';
            this.invitroPharmacologyService.bypassUpdateCheck();
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigateByUrl('/invitro-pharm/assaySetBuilder?assaySet=' + this.selectedAssaySet);
          }, 4000);
        }

        this.isLoading = false;
        this.loadingService.setLoading(false);
      },
    )
  }

  scrubExtraFields() {
    this.assaysToSave.forEach(assay => {
      if (assay) {
        if (assay._assaySet) {
          delete assay._assaySet;
        }
      }
    });
  }

}
