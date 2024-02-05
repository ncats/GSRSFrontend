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

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service'
import { InvitroAssayScreening } from '../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-details',
  templateUrl: './invitro-pharmacology-details.component.html',
  styleUrls: ['./invitro-pharmacology-details.component.scss']
})
export class InvitroPharmacologyDetailsComponent implements OnInit, OnDestroy {

  assayScreening: InvitroAssayScreening;
  id: string;
  assayTargetSubId = '';
  testCompoundSubId = '';
  ligandSubId = '';
  controlSubId = '';

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
    this.loadingService.setLoading(false);
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
      message: 'The web address above is incorrect. You\'re being forwarded to Browse Substances',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/browse-substance']);
    }, 5000);
  }

  getInvitroPharmacology(): void {
    const invitroSubscribe = this.invitroPharmacologyService.getAssayScreening(this.id).subscribe(response => {
      this.assayScreening = response;
      if (Object.keys(this.assayScreening).length > 0) {

        this.titleService.setTitle(`Invitro Pharmacology Assay Screening Details`);

        // Get Substance Id for Target Assay
        if (this.assayScreening.assayTargetUnii) {
          const assayTargetSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(this.assayScreening.assayTargetUnii).subscribe
            (substance => {
              if (substance) {
                this.assayTargetSubId = substance.uuid;
              }
            });
          this.subscriptions.push(assayTargetSubIdSubscription);
        }

        // Get Substance Id for Test Compound
        if (this.assayScreening.testAgentUnii) {
          const testCompoundSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(this.assayScreening.testAgentUnii).subscribe
            (substance => {
              if (substance) {
                this.testCompoundSubId = substance.uuid;
              }
            });
          this.subscriptions.push(testCompoundSubIdSubscription);
        }

        // Get Substance Id for Ligand/Substrate
        if (this.assayScreening.ligandSubstrateUnii) {
          const ligandSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(this.assayScreening.ligandSubstrateUnii).subscribe
            (substance => {
              if (substance) {
                this.ligandSubId = substance.uuid;
              }
            });
          this.subscriptions.push(ligandSubIdSubscription);
        }

        // Get Substance Id for control
        if (this.assayScreening.controlUnii) {
          const controlSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(this.assayScreening.controlUnii).subscribe
            (substance => {
              if (substance) {
                this.controlSubId = substance.uuid;
              }
            });
          this.subscriptions.push(controlSubIdSubscription);
        }


        /*
        // Get Substance Name for SubstanceUuid in SubstanceList
        this.impurities.impuritiesSubstanceList.forEach((elementRel, indexRel) => {
          if (elementRel.substanceUuid) {
            const impSubNameSubscription = this.generalService.getSubstanceBySubstanceUuid(elementRel.substanceUuid).subscribe
              (substance => {
                if (substance) {
                  elementRel.substanceName = substance._name;
                  elementRel.approvalID = substance.approvalID;
                }
              });
            this.subscriptions.push(impSubNameSubscription);
          }
        });

        // Get Substance Name for SubstanceUuid in ImpuritiesDetailsList
        this.impurities.impuritiesSubstanceList.forEach((elementRelSub) => {
          elementRelSub.impuritiesTestList.forEach((elementRelTest) => {
            elementRelTest.impuritiesDetailsList.forEach((elementRelImpuDet) => {
              if (elementRelImpuDet.relatedSubstanceUuid) {
                const impDetNameSubscription = this.generalService.getSubstanceBySubstanceUuid
                  (elementRelImpuDet.relatedSubstanceUuid)
                  .subscribe(substance => {
                    if (substance) {
                      elementRelImpuDet.substanceName = substance._name;
                      elementRelImpuDet.relatedSubstanceUnii = substance.approvalID;
                    }
                  });
                this.subscriptions.push(impDetNameSubscription);
              }
            });
          });
        });

        // Get Substance Name for SubstanceUuid in ImpuritiesResidualSolventsList
        this.impurities.impuritiesSubstanceList.forEach((elementSub) => {
          elementSub.impuritiesResidualSolventsTestList.forEach((elementResidualSolTest) => {
            elementResidualSolTest.impuritiesResidualSolventsList.forEach((elementResidual) => {
              if (elementResidual.relatedSubstanceUuid) {
                const impResidualNameSubscription = this.generalService.getSubstanceBySubstanceUuid
                  (elementResidual.relatedSubstanceUuid).subscribe(substance => {
                    if (substance) {
                      elementResidual.substanceName = substance._name;
                      elementResidual.relatedSubstanceUnii = substance.approvalID;
                    }
                  });
                this.subscriptions.push(impResidualNameSubscription);
              }
            });
          });
        });

        // Get Substance Name for SubstanceUuid in ImpuritiesInorganicList
        this.impurities.impuritiesSubstanceList.forEach((elementSub) => {
          elementSub.impuritiesInorganicTestList.forEach((elementInorganicTest) => {
            elementInorganicTest.impuritiesInorganicList.forEach((elementInorganic) => {
              if (elementInorganic.relatedSubstanceUuid) {
                const impInorganicNameSubscription = this.generalService.getSubstanceBySubstanceUuid
                  (elementInorganic.relatedSubstanceUuid).subscribe(substance => {
                    if (substance) {
                      elementInorganic.substanceName = substance._name;
                      elementInorganic.relatedSubstanceUnii = substance.approvalID;
                    }
                  });
                this.subscriptions.push(impInorganicNameSubscription);
              }
            });
          });
        });
        */
      }
    }, error => {
      this.handleSubstanceRetrivalError();
    });
    this.subscriptions.push(invitroSubscribe);
  }


  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size, true);
  }

  saveJSON(): void {
    // apply the same cleaning to remove deleted objects and return what will be sent to the server on validation / submission
    let json = this.assayScreening;
    // this.json = this.cleanObject(substanceCopy);
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'invitro_pharm_screening_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
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

}

