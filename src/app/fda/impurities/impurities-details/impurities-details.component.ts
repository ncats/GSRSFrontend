import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';
import * as moment from 'moment';

/* GSRS Core */
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';

/* GSRS Impurities */
import { GeneralService } from '../../service/general.service';
import { ImpuritiesService } from '../service/impurities.service';
import { Impurities, ImpuritiesSolutionTable } from '../model/impurities.model';

@Component({
  selector: 'app-impurities-details',
  templateUrl: './impurities-details.component.html',
  styleUrls: ['./impurities-details.component.scss'],
  standalone: false
})
export class ImpuritiesDetailsComponent implements OnInit, OnDestroy {

  public ELUTION_TYPE_ISOCRATIC = 'ISOCRATIC';
  public ELUTION_TYPE_GRADIENT = 'GRADIENT';

  dataSource: MatTableDataSource<ImpuritiesSolutionTable>;
  private subscriptions: Array<Subscription> = [];
  displayedColumnsRow: string[][] = [];

  id: string;
  impurities: Impurities;
  substanceName = '';
  isImportFromFile = false;

  flagIconSrcPath: string;
  canEdit: boolean = false;
  title: string;
  message = '';
  subRelationship: any;
  downloadJsonHref: any;
  jsonFileName: string;

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private utilsService: UtilsService,
    private loadingService: LoadingService,
    private gaService: GoogleAnalyticsService,
    private mainNotificationService: MainNotificationService,
    private impuritiesService: ImpuritiesService,
    private generalService: GeneralService,
    private titleService: Title,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.loadingService.setLoading(true);

    this.canEdit = await this.authService.hasSpecificPrivilege('Edit');
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id != null) {
      this.title = "Impurities Details";

      this.getImpurities();
    } else {
      const action = this.activatedRoute.snapshot.queryParams['action'] || null;

      if (action && action === 'import' && window.history.state) { // IMPORT IMPURITIES
        this.title = "Impurities Import From File";
        this.isImportFromFile = true;

        const record = window.history.state.record;
        const response = JSON.parse(record);
        if (response) {
          this.impurities = response;

          this.getSubstanceDetailsbySubstanceUuid();

          this.getSubstanceDetailsbySubstanceName();
        }
      }
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
    const getImpuritiesSubscribe = this.impuritiesService.getImpuritiesDetails(this.id).subscribe(response => {
      this.impurities = response;
      if (Object.keys(this.impurities).length > 0) {

        this.titleService.setTitle(`Impurities Details`);

        this.getSubstanceDetailsbySubstanceUuid();
      }
    }, error => {
      this.handleSubstanceRetrivalError();
    });
    this.subscriptions.push(getImpuritiesSubscribe);
  }

  getSubstanceDetailsbySubstanceUuid() {
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
      elementRelSub.impuritiesTestList.forEach((elementRelTest, indexTest) => {

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

        // Get Mobile Phase
        this.getMobilPhase(elementRelTest, indexTest);

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

  getSubstanceDetailsbySubstanceName() {

    // Get Substance Name for Impurities in ImpuritiesDetailsList
    this.impurities.impuritiesSubstanceList.forEach((elementRelSub) => {
      elementRelSub.impuritiesTestList.forEach((elementRelTest, indexTest) => {

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

        // Get Mobile Phase
        this.getMobilPhase(elementRelTest, indexTest);

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

  getMobilPhase(elementRelTest: any, indexTest: number) {
    // Populate columns for Mobile Phase
    // add letter in the Mobile Phase column
    if (elementRelTest.impuritiesSolutionList) {
      if (elementRelTest.impuritiesSolutionList.length > 0) {

        let displayedColumns = [
          'Time (min)'
        ]

        elementRelTest.impuritiesSolutionList.forEach(solution => {
          if (solution) {

            if (solution.solutionLetter) {
              let columnName = 'Solution ' + solution.solutionLetter + ' (%)';
              displayedColumns.push(columnName);

              this.displayedColumnsRow[indexTest] = displayedColumns;
            }
          }
        });
      } // impuritiesSolutionTableList length > 0
    } // impuritiesSolutionTableList exists

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

  openInRegisterForm() {
    const imp = JSON.stringify(this.impurities);
    this.router.navigateByUrl('/impurities/register?action=import', { state: { record: imp } });
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size, true);
  }

  saveJSON(): void {
    // apply the same cleaning to remove deleted objects and return what will be sent to the server on validation / submission
    let json = this.cleanImpurities();

    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'impurities_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
  }

  showJSON(): void {
    const date = new Date();
    let jsonFilename = 'impurities_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    let cleanImpurities = this.cleanImpurities();

    let data = { jsonData: cleanImpurities, jsonFilename: jsonFilename };

    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: data
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  cleanImpurities(): any {
    const copiedImpurities = _.cloneDeep(this.impurities);

    // delete copiedImpurities._dateTypeDate;

    return copiedImpurities;
  }

}
