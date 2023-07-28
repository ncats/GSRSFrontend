import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

/* GSRS Core Imports */
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GeneralService } from '../../service/general.service';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service'
import { InvitroPharmacologyOverview, InvitroAssay } from '../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-details',
  templateUrl: './invitro-pharmacology-details.component.html',
  styleUrls: ['./invitro-pharmacology-details.component.scss']
})
export class InvitroPharmacologyDetailsComponent implements OnInit, OnDestroy {

  //invitroPharm: InvitroPharmacologyOverview;
  invitroPharm: any;
  id: string;
  substanceName = '';
  flagIconSrcPath: string;
  updateApplicationUrl: string;
  message = '';
  subRelationship: any;
  isAdmin = false;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private authService: AuthService,
    private utilsService: UtilsService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private generalService: GeneralService,
    private invitroPharmacologyService: InvitroPharmacologyService,
  ) { }

  ngOnInit() {
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
    const invitroSubscribe = this.invitroPharmacologyService.getInvitroPharmacology(this.id).subscribe(response => {
      this.invitroPharm = response;
      if (Object.keys(this.invitroPharm).length > 0) {

        this.titleService.setTitle(`Invitro Pharmacology Details`);

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

}

