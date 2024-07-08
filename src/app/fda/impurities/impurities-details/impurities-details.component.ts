import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ImpuritiesService } from '../service/impurities.service';
import { GeneralService } from '../../service/general.service';
import { Impurities, ImpuritiesSolutionTable } from '../model/impurities.model';

@Component({
  selector: 'app-impurities-details',
  templateUrl: './impurities-details.component.html',
  styleUrls: ['./impurities-details.component.scss']
})
export class ImpuritiesDetailsComponent implements OnInit, OnDestroy {

  public ELUTION_TYPE_ISOCRATIC = 'ISOCRATIC';

  dataSource: MatTableDataSource<ImpuritiesSolutionTable>;

  id: string;
  impurities: Impurities;
  substanceName = '';
  flagIconSrcPath: string;
  isAdmin = false;
  updateApplicationUrl: string;
  message = '';
  subRelationship: any;
  private subscriptions: Array<Subscription> = [];


  displayedColumns = [
    'Number',
    'Time (min)'
  ]

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
    private titleService: Title
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

        this.titleService.setTitle(`Impurities Details`);

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

            // assign Mobile Phase list to datasource to display on table
            this.dataSource = new MatTableDataSource(elementRelTest.impuritiesSolutionTableList);

            // Populate columns for Mobile Phase
            // add letter in the Mobile Phase column
            if (elementRelTest.impuritiesSolutionList) {
              if (elementRelTest.impuritiesSolutionList.length > 0) {
                elementRelTest.impuritiesSolutionList.forEach(solution => {
                  if (solution) {
                    if (solution.solutionLetter) {
                      let columnName = 'Solution ' + solution.solutionLetter + ' (%)';
                      this.displayedColumns.push(columnName);
                    }
                  }
                });

              } // impuritiesSolutionTableList length > 0
            } // impuritiesSolutionTableList exists
          }); // Loop: elementRelSub.impuritiesTestList
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
