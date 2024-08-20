import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

/* GSRS Core Imports */
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GeneralService } from '../../service/general.service';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { StructureImageModalComponent } from '@gsrs-core/structure';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service'
import { InvitroAssayInformation } from '../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-details',
  templateUrl: './invitro-pharmacology-details.component.html',
  styleUrls: ['./invitro-pharmacology-details.component.scss']
})
export class InvitroPharmacologyDetailsComponent implements OnInit, OnDestroy {

  assay: InvitroAssayInformation;
  id: string;
  assayTargetSubId = '';
  testCompoundSubId = '';
  ligandSubId = '';
  controlSubId = '';
  showMoreLessFieldsArray: Array<boolean> = [];
  showMoreLessResultFieldsArray: Array<boolean> = [];
  showMoreLessFields = true;
  showMoreLessResultFields = true;
  resultInformationIndex = -1;

  downloadJsonHref: any;
  jsonFileName: string;
  flagIconSrcPath: string;

  isAdmin = false;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private overlayContainerService: OverlayContainer,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private utilsService: UtilsService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private generalService: GeneralService,
    private invitroPharmacologyService: InvitroPharmacologyService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.loadingService.setLoading(true);

    const rolesSubscription = this.authService.hasAnyRolesAsync('admin', 'updater', 'superUpdater').subscribe(canEdit => {
      this.isAdmin = canEdit;
    });
    this.subscriptions.push(rolesSubscription);

    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id != null) {
      this.getInvitroPharmacology();
    } else {
      this.handleSubstanceRetrivalError();
    }
    //this.loadingService.setLoading(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  private handleSubstanceRetrivalError() {
    this.loadingService.setLoading(false);
    const notification: AppNotification = {
      message: 'The web address above is incorrect. You\'re being forwarded to Home Page',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 5000);
  }

  getInvitroPharmacology(): void {
    const invitroSubscribe = this.invitroPharmacologyService.getAssayById(this.id).subscribe(response => {
      if (response) {
        this.assay = response;

        // Create Result Information List to display on the Details page
        this.createResultInfomrationList();

        if (Object.keys(this.assay).length > 0) {
          this.titleService.setTitle(`Invitro Pharmacology Assay Details ` + this.id);

          this.loadingService.setLoading(false);
        }
        /*

        // Get Substance Id for Test Compound
        if (this.assay.testAgentApprovalId) {
          const testCompoundSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(this.assay.testAgentUnii).subscribe
            (substance => {
              if (substance) {
                this.testCompoundSubId = substance.uuid;
              }
            });
          this.subscriptions.push(testCompoundSubIdSubscription);
        }
        */

        /*
        // Get Substance Id for Ligand/Substrate
        if (this.assay.ligandSubstrateApprovalId) {
          const ligandSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(this.assay.ligandSubstrateUnii).subscribe
            (substance => {
              if (substance) {
                this.ligandSubId = substance.uuid;
              }
            });
          this.subscriptions.push(ligandSubIdSubscription);
        }
        */

      } // response
    }, error => {
      this.loadingService.setLoading(false);
      this.handleSubstanceRetrivalError();
    });
    this.subscriptions.push(invitroSubscribe);
  }


  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size, true);
  }

  saveJSON(): void {
    // apply the same cleaning to remove deleted objects and return what will be sent to the server on validation / submission
    let json = this.assay;
    // this.json = this.cleanObject(substanceCopy);
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'invitro_pharm_screening_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
  }

  showJSON(): void {
    const date = new Date();
    let jsonFilename = 'invitro_pharm_assay_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    let data = {jsonData: this.assay, jsonFilename: jsonFilename};

    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: data
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  openImageModal(uuid: string) {
    const dialogRef = this.dialog.open(StructureImageModalComponent, {
      height: '90%',
      width: '650px',
      panelClass: 'structure-image-panel',
      data: { structure: uuid }
    });

    this.overlayContainer.style.zIndex = '1002';

    const subscription = dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    }, () => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    });
  }

  toggleShowMoreLessFields() {
    this.showMoreLessFields = !this.showMoreLessFields;
  }

  toggleShowMoreLessResultFields() {
    this.showMoreLessResultFields = !this.showMoreLessResultFields;
  }

  toggleShowMoreLessFieldsArray(indexScreening) {
    this.showMoreLessFieldsArray[indexScreening] = !this.showMoreLessFieldsArray[indexScreening];
  }

  toggleShowMoreLessResultFieldsArray(indexScreening) {
    this.showMoreLessResultFieldsArray[indexScreening] = !this.showMoreLessResultFieldsArray[indexScreening];
  }

  createResultInfomrationList() {
    if (this.assay) {

      this.assay._resultInformationList = [];

      /* Assay Informtion Reference loop */
      this.assay.invitroAssayScreenings.forEach(screening => {

        /* Invitro Assay Control exists */
        if (screening.invitroControls.length > 0) {
          //  assaySummary.controls = screening.invitroControls;
        }

        if (screening.invitroAssayResultInformation) {

          let resultInfoId = screening.invitroAssayResultInformation.id;
          let resultInfo = screening.invitroAssayResultInformation;

          // Get the index if the value exists in the key 'referenceSourceTypeNumber'
          const foundIndex = this.assay._resultInformationList.findIndex(record => record.id === resultInfoId);

          // If value found in the existing list, add the current list.
          if (foundIndex > -1) {
            if (screening.invitroAssayResult != null) {
              this.assay._resultInformationList[foundIndex].invitroAssayResultList.push(screening.invitroAssayResult);
            }

            if (screening.invitroSummary != null) {
              this.assay._resultInformationList[foundIndex].invitroSummaryList.push(screening.invitroSummary);
            }

            if (screening.invitroControls != null) {
              this.assay._resultInformationList[foundIndex].invitroControlList = screening.invitroControls;
            }
          } else {
            // New, Not found in the exising result information List
            let invitroAssayResultList = [];
            let invitroSummaryList = [];
            let invitroControls = null;

            if (screening.invitroAssayResult != null) {
              invitroAssayResultList.push(screening.invitroAssayResult);
            }

            if (screening.invitroSummary != null) {
              invitroSummaryList.push(screening.invitroSummary);
            }

            if (screening.invitroControls != null) {
              invitroControls = screening.invitroControls;
            }

            const newResultInfo = { 'id': resultInfoId, 'invitroAssayResultInformation': resultInfo, 'invitroAssayResultList': invitroAssayResultList, 'invitroSummaryList': invitroSummaryList, 'invitroControlList': invitroControls };
            this.assay._resultInformationList.push(newResultInfo);

            // Set Show/Hide value to true. It means hide more fields initially
            this.resultInformationIndex = this.resultInformationIndex + 1;
            this.showMoreLessFieldsArray[this.resultInformationIndex] = true;
            this.showMoreLessResultFieldsArray[this.resultInformationIndex] = true;

          } // else
        } // invitroAssayResultInformation

      }); // LOOP: AssayScreenings

    } // if assay exists
  }

}

