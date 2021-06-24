import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ImpuritiesService } from '../service/impurities.service';
import { GeneralService } from '../../service/general.service';
import { Impurities } from '../model/impurities.model';

@Component({
  selector: 'app-impurities-details',
  templateUrl: './impurities-details.component.html',
  styleUrls: ['./impurities-details.component.scss']
})
export class ImpuritiesDetailsComponent implements OnInit, OnDestroy {

  id: string;
  impurities: Impurities;
  substanceName = '';
  flagIconSrcPath: string;
  isAdmin = false;
  updateApplicationUrl: string;
  message = '';
  subRelationship: any;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private utilsService: UtilsService,
    private loadingService: LoadingService,
    private gaService: GoogleAnalyticsService,
    private mainNotificationService: MainNotificationService,
    private impuritiesService: ImpuritiesService,
    private generalService: GeneralService,
  ) { }

  ngOnInit() {
    this.loadingService.setLoading(true);

    const rolesSubscription = this.authService.hasAnyRolesAsync('admin', 'updater', 'superUpdater').subscribe(canEdit => {
      this.isAdmin = canEdit;
    });
    this.subscriptions.push(rolesSubscription);

    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id != null) {
      this.getImpurities();
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

  getImpurities(): void {
    const getImpuritiesSubscribe = this.impuritiesService.getImpurities(this.id).subscribe(response => {
      this.impurities = response;
      if (Object.keys(this.impurities).length > 0) {

        // Get Substance Name for SubstanceUuid in SubstanceList
        this.impurities.impuritiesSubstanceList.forEach((elementRel, indexRel) => {
          if (elementRel.substanceUuid) {
            const impSubNameSubscription = this.generalService.getSubstanceBySubstanceUuid(elementRel.substanceUuid).subscribe
              (substance => {
                if (substance) {
                  elementRel.substanceName = substance._name;
                  elementRel.relatedSubstanceUnii = substance.approvalID;
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
        this.impurities.impuritiesSubstanceList.forEach((elementRelSub) => {
          elementRelSub.impuritiesResidualSolventsList.forEach((elementRelResidual) => {
            if (elementRelResidual.relatedSubstanceUuid) {
              const impResidualNameSubscription = this.generalService.getSubstanceBySubstanceUuid
                (elementRelResidual.relatedSubstanceUuid).subscribe(substance => {
                  if (substance) {
                    elementRelResidual.substanceName = substance._name;
                    elementRelResidual.relatedSubstanceUnii = substance.approvalID;
                  }
                });
              this.subscriptions.push(impResidualNameSubscription);
            }
          });
        });

        // Get Substance Name for SubstanceUuid in ImpuritiesInorganicList
        this.impurities.impuritiesSubstanceList.forEach((elementRelSub) => {
          elementRelSub.impuritiesInorganicList.forEach((elementRelInorganic) => {
            if (elementRelInorganic.relatedSubstanceUuid) {
              const impInorganicNameSubscription = this.impuritiesService.getSubstanceDetailsBySubstanceId
                (elementRelInorganic.relatedSubstanceUuid).subscribe(substanceNames => {
                  if (substanceNames) {
                    elementRelInorganic.substanceName = substanceNames.name;
                    elementRelInorganic.relatedSubstanceUnii = substanceNames.unii;
                  }
                });
              this.subscriptions.push(impInorganicNameSubscription);
            }
          });
        });

      }
    }, error => {
      this.handleSubstanceRetrivalError();
    });
    this.subscriptions.push(getImpuritiesSubscribe);
  }

  getSubstancePreferredName(substanceUuid: string) {
    let name = '';
    const getSubDetailsSubscribe = this.generalService.getSubstanceBySubstanceUuid(substanceUuid).subscribe(substance => {
      if (substance) {
        name = substance._name;
      }
    });
    this.subscriptions.push(getSubDetailsSubscribe);
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

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size, true);
  }

}
